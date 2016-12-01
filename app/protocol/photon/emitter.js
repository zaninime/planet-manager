/* @flow */
import { twilightDuration, floorIntensity, compactChannels } from './constants';
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
    const x = mainColor;
    const i = intensity;

    if (x < -1 || x > 1) {
        throw new Error(`MainColor value is out of range. It should be between -1 and 1, but is ${x}.`);
    }
    if (i < 0 || x > 1) {
        throw new Error(`Intensity value is out of range. It should be between 0 and 1, but is ${i}.`);
    }

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
    const minimumSlopeTime = 10;
    const dawn = config.timings.dawnBeginsAt;
    const dusk = config.timings.duskEndsAt;
    if (config.timings.dawnBeginsAt < 0 || config.timings.dawnBeginsAt > (lastMinuteOfDay - (2 * twilightDuration))) {
        throw new Error(`Dawn value ${config.timings.dawnBeginsAt} is out of range.`);
    }
    if (config.timings.duskEndsAt < dawn + (2 * twilightDuration) || config.timings.duskEndsAt > lastMinuteOfDay) {
        throw new Error(`Dusk value ${config.timings.duskEndsAt} is out of range.`);
    }

    const duration = (dusk - dawn) - (2 * twilightDuration);
    const delay = dawn + (((twilightDuration - minimumSlopeTime) / twilightDuration) *
    (config.twilight.redLevel * twilightDuration));
    const slope = minimumSlopeTime + (
        ((1 - config.twilight.redLevel) * twilightDuration) * ((twilightDuration - minimumSlopeTime) / twilightDuration)
    );

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

    const expectedKeys = ['color', 'enabled'];
    if (!config.channels.every(c => expectedKeys.every(e => e in c))) {
        throw new Error("Every channel object must have a 'color' and an 'enabled' field");
    }

    const colors = ['white', 'red', 'green', 'blue'];
    if (!config.channels.every(c => colors.indexOf(c.color) > -1)) {
        throw new Error('Strip configuration contains an invalid color');
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

    const expectedKeys = ['fanStart', 'shutdown'];
    if (!expectedKeys.every(e => e in config.temperature)) {
        throw new Error("Temperature configuration must have a 'fanStart' and a 'shutdown' field");
    }

    const { fanStart, shutdown } = config.temperature;

    if (fanStart < 0 || fanStart > 999) {
        throw new RangeError(`Fan start temperature value ${fanStart} is out of range`);
    } else if (shutdown < 0 || shutdown > 999) {
        throw new RangeError(`Shutdown temperature value ${shutdown} is out of range`);
    }

    return {
        fanStart: Math.round(fanStart),
        shutdown: Math.round(shutdown),
    };
};

export const fan = (config: HighLevelConfig, { features }: Caps) => {
    if (!features.FAN_CONFIG) {
        return {
            minSpeed: 0,
            speedRamp: 0,
            maxSpeed: 0,
        };
    }

    const expectedKeys = ['minSpeed', 'maxSpeed', 'speedRamp'];
    if (!expectedKeys.every(e => e in config.fan)) {
        throw new Error("Fan configuration must have a 'minSpeed', a 'maxSpeed' and a 'speedRamp' field");
    }

    const { minSpeed, speedRamp, maxSpeed } = config.fan;

    if (maxSpeed < 0 || maxSpeed > 1) {
        throw new RangeError(`Fan maximum speed value ${maxSpeed} is out of range`);
    } else if (minSpeed < 0 || minSpeed > 1) {
        throw new RangeError(`Fan minimum speed value ${minSpeed} is out of range`);
    } else if (maxSpeed < minSpeed) {
        throw new RangeError('Fan maximum speed is less than the minimum speed');
    }

    return {
        maxSpeed: Math.round(maxSpeed * 100),
        minSpeed: Math.round(minSpeed * 100),
        speedRamp,
    };
};

export const night = (config: HighLevelConfig) => {
    const expectedKeys = ['color', 'intensity'];
    if (!expectedKeys.every(e => e in config.night)) {
        throw new Error("Fan configuration must have a 'color' and an 'intensity' field");
    }

    const { intensity, color } = config.night;

    if (intensity < 0 || intensity > 1) {
        throw new RangeError(`Night intensity value ${intensity} is out of range`);
    }

    const colors = ['white', 'blue'];
    if (colors.indexOf(color) === -1) {
        throw new Error(`Invalid night color: '${color}'`);
    }

    return {
        color,
        intensity: Math.round(config.night.intensity * 100),
    };
};

export const mode = (config: HighLevelConfig) => (config.master ? 'master' : 'slave');

export const emitDemo = daylightColor;

const emit = (config: HighLevelConfig, caps: { features: Features, bugs: string[] }) => {
    const emitter = emitTarget({ daylight, channels, temperature, fan, night, mode });
    const goodConfig = emitter(config, caps);
    const brokenConfig = supportOnSave(goodConfig, caps.bugs);
    return brokenConfig;
};

export default emit;
