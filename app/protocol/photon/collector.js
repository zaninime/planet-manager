/*
 * @flow
 */

import clamp from 'app/utils/clamp';
import { blockOnFetch } from './bugs';
import { twilightDuration, floorIntensity, compactChannels } from './constants';
import * as lamps from './lamps';
import type { LowLevelConfig, LampStatus, Features } from './types';

const collectTarget = target => (config: LowLevelConfig, status: LampStatus) =>
    Object.keys(target).reduce((acc, key) => {
        const result = acc;
        result[key] = target[key](config, status);
        return result;
    }, {});

export const daylight = (config: LowLevelConfig) => {
    const r = config.daylight.red.intensity / 100;
    const b = config.daylight.blue.intensity / 100;
    const w = config.daylight.white.intensity / 100;

    let intensity = Math.round(((Math.max(r, b) - floorIntensity) / (1 - floorIntensity)) * 100) / 100;

    let mainColor;

    mainColor = (-85 / 60) * (((w - floorIntensity) / (intensity * (1 - floorIntensity))) - 1);
    mainColor = Math.round(((r > b) ? (-mainColor) : mainColor) * 100) / 100;

    mainColor = clamp(mainColor, -1, 1);
    intensity = clamp(intensity, 0, 1);

    if (intensity === 0 || (w > r && w > b) || r === b) {
        // with non compatible values and 0 intensity, maincolor is NaN because of division by 0.
        mainColor = 0;
    }

    return {
        mainColor,
        intensity,
    };
};

export const night = (config: LowLevelConfig) => ({
    color: config.night.color,
    intensity: Math.min(Math.max(config.night.intensity / 100, 0), 1),
});

const lastMinuteOfDay = (60 * 24) - 1;

export const timings = (config: LowLevelConfig) => ({
    dawnBeginsAt: Math.min(
        config.daylight.red.delay, lastMinuteOfDay - (config.daylight.red.duration + (2 * twilightDuration))),
    duskEndsAt: Math.min(
        (config.daylight.red.delay + config.daylight.red.duration + (2 * twilightDuration)), lastMinuteOfDay),
});

export const twilight = (config: LowLevelConfig) => ({
    redLevel: Math.min(1, Math.max(0, (config.daylight.white.delay - config.daylight.red.delay) / twilightDuration)),
});

export const channels = (config: LowLevelConfig, status: LampStatus) => {
    const convert = channel => {
        if (channel === 'off') {
            return { color: 'white', enabled: false };
        }
        return { color: channel, enabled: true };
    };
    const model = lamps.detectModel(status);

    if (model === lamps.COMPACT) {
        return compactChannels.map(idx => convert(config.channels[idx]));
    }
    return config.channels.map(convert);
};

export const temperature = (config: LowLevelConfig) => {
    const { fanStart, shutdown } = config.temperature;
    return {
        fanStart,
        shutdown,
    };
};

export const fan = (config: LowLevelConfig) => {
    const { maxSpeed, minSpeed, speedRamp } = config.fan;

    return {
        maxSpeed: maxSpeed / 100,
        minSpeed: minSpeed / 100,
        speedRamp,
    };
};

export const master = (config: LowLevelConfig) => config.mode === 'master';

export const features = (config: LowLevelConfig, status: LampStatus): Features => {
    const model = lamps.detectModel(status);
    const featureMap = {
        [lamps.PRO]: {
            CHANNEL_MAPPING: true,
            CLOCK_SYNC: true,
            FAN_CONFIG: true,
            TEMPERATURE_CONFIG: true,
            MASTER_SWITCH: true,
            DEMO_MODE: true,
        },
        [lamps.COMPACT]: {
            CHANNEL_MAPPING: true,
            CHANNEL_MAPPING_COMPACT: true,
            CLOCK_SYNC: true,
            FAN_CONFIG: true,
            TEMPERATURE_CONFIG: true,
            MASTER_SWITCH: true,
            DEMO_MODE: true,
        },
        [lamps.PRO_V2]: {
            CHANNEL_MAPPING: true,
            CLOCK_SYNC: true,
            FAN_CONFIG: true,
            TEMPERATURE_CONFIG: true,
            DEMO_MODE: true,
        },
        [lamps.STELLA]: {
            CLOCK_SYNC: true,
            DEMO_MODE: true,
        },
    };
    return featureMap[model];
};

const collect = (config: LowLevelConfig, status: LampStatus) => {
    const convert = collectTarget({ daylight, night, timings, twilight, channels, temperature, fan, master, features });
    const { config: bugFreeConfig, bugs } = blockOnFetch(config, status);
    return { ...convert(bugFreeConfig, status), bugs };
};

export default collect;
