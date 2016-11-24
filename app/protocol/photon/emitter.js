/* @flow */
import { twilightDuration, floorIntensity, compactChannels } from './constants';
import clamp from 'app/utils/clamp';
import { supportOnSave } from './bugs';
import type { HighLevelConfig, Features } from './types';

type Caps = { features: Features, bugs: string[] };

const emitTarget = target => (config, caps) =>
   Object.keys(target).reduce((nextTarget, key) => {
       const result = nextTarget;
       result[key] = target[key](config, caps);
       return result;
   }, {})
;

const daylightColor = (mainColor: number, intensity: number) => {
    const x = clamp(mainColor, -1, 1);
    const i = clamp(intensity, 0, 1);

    let red = 0;
    let green = 0;
    let blue = 0;
    let white = 0;
    if (x < 0) {
        red = 100 * (floorIntensity + (i * (1 - floorIntensity)));
    } else if (x >= 0 && x < 0.5) {
        red = 100 * (floorIntensity + (i * (1 - floorIntensity) * (1 - (2 * x))));
    } else if (x >= 0.5) {
        red = 100 * (floorIntensity);
    }

    if (x >= -0.5 && x < 0.5) {
        green = 100 * (floorIntensity + (i * (1 - floorIntensity) * (1 - ((60 / 85) * Math.abs(x)))));
    } else if (x < -0.5 || x >= 0.5) {
        green = 100 * (floorIntensity + (i * (1 - floorIntensity) * ((110 / 85) - ((110 / 85) * Math.abs(x)))));
    }

    if (x >= 0) {
        blue = 100 * (floorIntensity + (i * (1 - floorIntensity)));
    } else if (x >= -0.5 && x < 0) {
        blue = 100 * (floorIntensity + (i * (1 - floorIntensity) * (1 + (2 * x))));
    } else if (x < -0.5) {
        blue = 100 * (floorIntensity);
    }

    if (x >= -1 && x <= 1) {
        white = 100 * (floorIntensity + (i * (1 - floorIntensity) * (1 - ((60 / 85) * Math.abs(x)))));
    } else {
        white = 100 * (floorIntensity + (i * (1 - floorIntensity) * (25 / 85)));
    }

    red = Math.round(red);
    green = Math.round(green);
    blue = Math.round(blue);
    white = Math.round(white);

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

export const channels = (config: HighLevelConfig, { features }: Caps) => {
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

export const temperature = (config: HighLevelConfig, { features }: Caps) => {
    if (!features.TEMPERATURE_CONFIG) {
        return {
            fanStart: 0,
            shutdown: 0,
        };
    }
    return { ...config.temperature };
};

export const fan = (config: HighLevelConfig, { features }: Caps) => {
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
