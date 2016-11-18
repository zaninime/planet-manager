/* @flow */
import { twilightDuration, floorIntensity, compactChannels } from './constants';
import { supportOnSave } from './bugs';
import type { HighLevelConfig, Features } from './types';

const emitTarget = target => (config, caps) =>
   Object.keys(target).reduce((nextTarget, key) => {
       const result = nextTarget;
       result[key] = target[key](config, caps);
       return result;
   }, {})
;

// function clipping the value in a strict range
const clamp = (value, minValue, maxValue) => Math.min(Math.max(value, minValue), maxValue);

const daylightColor = (mainColor: number, intensity: number) => {
    const x = clamp(mainColor, -1, 1);
    const i = clamp(intensity, 0, 1);

    const red = 100 * (floorIntensity + Math.max(i * (1 - floorIntensity) * (-x), 0));
    let green;
    if ((x >= -1 && x < -0.5) || (x > 0.5 && x <= 1)) {
        green = 100 * ((2 / 3) * (floorIntensity + ((i * (1 - floorIntensity)) * (1 - (Math.abs(x))))));
    } else if (x >= -0.5 && x <= 0.5) {
        green = 100 * ((2 / 3) * (floorIntensity + ((i * (1 - floorIntensity)) * ((3 / 4) - Math.abs(x / 2)))));
    }

    const blue = 100 * (floorIntensity + Math.max(i * (1 - floorIntensity) * (x), 0));
    const white = 100 * (floorIntensity + ((i * (1 - floorIntensity)) * (1 - Math.abs(x))));

    return { white, red, green, blue };
};

export const daylight = (config: HighLevelConfig) => {
    const lastMinuteOfDay = (60 * 24) - 1;
    const dawn = clamp(config.timings.dawnBeginsAt, 0, lastMinuteOfDay - (2 * twilightDuration));
    const dusk = clamp(config.timings.duskEndsAt, dawn + (2 * twilightDuration), lastMinuteOfDay);

    const duration = (dusk - dawn) - (2 * twilightDuration);
    const delay = dawn + (config.twilight.redLevel * twilightDuration);
    const slope = (1 - config.twilight.redLevel) * twilightDuration;

    const { white, red, green, blue } = daylightColor(config.daylight.mainColor, config.daylight.intensity);

    return {
        white: {
            intensity: white,
            duration,
            delay,
            slope,
        },
        red: {
            intensity: red,
            duration,
            delay: dawn,
            slope: twilightDuration,
        },
        green: {
            intensity: green,
            duration,
            delay,
            slope,
        },
        blue: {
            intensity: blue,
            duration,
            delay,
            slope,
        },
    };
};

export const channels = (config: HighLevelConfig, { features }) => {
    const convert = (ch) => {
        if (!ch.enabled) return 'off';
        return ch.color;
    };
    if (!features.CHANNEL_MAPPING) {
        return ['off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off'];
    }
    if (features.CHANNEL_MAPPING_COMPACT) {
        const base = ['off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off', 'off'];
        return base.map((e, i) => {
            const idx = compactChannels.indexOf(i);
            if (idx < 0) return e;
            return convert(config.channels[idx]);
        });
    }
    return config.channels.map(convert);
};

export const temperature = (config: HighLevelConfig, { features }) => {
    if (!features.TEMPERATURE_CONFIG) {
        return {
            fanStart: 0,
            shutdown: 0,
        };
    }
    return { ...config.temperature };
};

export const fan = (config: HighLevelConfig, { features }) => {
    if (!features.FAN_CONFIG) {
        return {
            minSpeed: 0,
            speedRamp: 0,
            maxSpeed: 0,
        };
    }
    return { ...config.fan };
};

export const night = (config: HighLevelConfig) => ({
    color: config.night.color,
    intensity: Math.round(config.night.intensity * 100),
});

export const mode = (config: HighLevelConfig) => (config.master ? 'master' : 'slave');

export const emitDemo = daylightColor;

const emit = (config: HighLevelConfig, caps: { features: Features, bugs: string[] }) => {
    const emitter = emitTarget({ daylight, channels, temperature, fan, night, mode });
    const goodConfig = emitter(config, caps);
    const brokenConfig = supportOnSave(goodConfig, caps.bugs);
    return brokenConfig;
};

export default emit;
