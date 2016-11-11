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

const daylight = (config) => {
    const x = config.daylight.mainColor;
    const i = config.daylight.intensity;
    const dawn = config.timings.dawnBeginsAt;
    const dusk = config.timings.duskEndsAt;

    const r = 100 * (floorIntensity + Math.max(i * (1 - floorIntensity) * (-x), 0));
    let g;
    if ((x >= -1 && x < -0.5) || (x > 0.5 && x <= 1)) {
        g = 100 * ((2 / 3) * (floorIntensity + ((i * (1 - floorIntensity)) * (1 - (Math.abs(x))))));
    } else if (x >= -0.5 && x <= 0.5) {
        g = 100 * ((2 / 3) * (floorIntensity + ((i * (1 - floorIntensity)) * ((3 / 4) - Math.abs(x / 2)))));
    }

    const b = 100 * (floorIntensity + Math.max(i * (1 - floorIntensity) * (x), 0));
    const w = 100 * (floorIntensity + ((i * (1 - floorIntensity)) * (1 - Math.abs(x))));

    const duration = (dusk - dawn) - (2 * twilightDuration);
    const delay = dawn + (config.twilight.redLevel * twilightDuration);
    const slope = (1 - config.twilight.redLevel) * twilightDuration;

    return {
        white: {
            intensity: w,
            duration,
            delay,
            slope,
        },
        red: {
            intensity: r,
            duration,
            delay: dawn,
            slope: twilightDuration,
        },
        green: {
            intensity: g,
            duration,
            delay,
            slope,
        },
        blue: {
            intensity: b,
            duration,
            delay,
            slope,
        },
    };
};

const channels = (config, { features }) => {
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

const temperature = (config, { features }) => {
    if (!features.TEMPERATURE_CONFIG) {
        return {
            fanStart: 0,
            shutdown: 0,
        };
    }
    return { ...config.temperature };
};

const fan = (config, { features }) => {
    if (!features.FAN_CONFIG) {
        return {
            minSpeed: 0,
            speedRamp: 0,
            maxSpeed: 0,
        };
    }
    return { ...config.fan };
};

const night = config => ({
    color: config.night.color,
    intensity: Math.round(config.night.intensity * 100),
});

const mode = config => (config.master ? 'master' : 'slave');

const emit = (config: HighLevelConfig, caps: { features: Features, bugs: string[] }) => {
    const emitter = emitTarget({ daylight, channels, temperature, fan, night, mode });
    const goodConfig = emitter(config, caps);
    const brokenConfig = supportOnSave(goodConfig, caps.bugs);
    return brokenConfig;
};

export default emit;