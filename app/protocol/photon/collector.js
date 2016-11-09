/*
 * eslint-disable no-unused-vars
 * @flow
 */

import EError from 'app/utils/error';
import { blockOnFetch } from './bugs';
import { twilightDuration, floorIntensity, compactChannels } from './constants';
import * as lamps from './lamps';
import type { LowLevelConfig, LampStatus, Features } from './types';

class IncompatibleConfigError extends EError {}

const collectTarget = target => (config: LowLevelConfig, status: LampStatus) =>
    Object.keys(target).reduce((acc, key) => {
        acc[key] = target[key](config, status);
        return acc;
    }, {});

const daylight = (config: LowLevelConfig) => {
    const r = config.daylight.red.intensity / 100;
    const b = config.daylight.blue.intensity / 100;
    const w = config.daylight.white.intensity / 100;

    const intensity = +(Math.max(((r + w - 2 * floorIntensity) / (1 - floorIntensity)), ((b + w - 2 * floorIntensity) / (1 - floorIntensity)))).toFixed(2);
    let mainColor;
    if (b > r) {
        mainColor = (b - floorIntensity) / ((1 - floorIntensity) * intensity);
    } else if (r > b) {
        mainColor = -(r - floorIntensity) / ((1 - floorIntensity) * intensity);
    } else if (r === b) {
        mainColor = 0;
    } else {
        throw new IncompatibleConfigError('Invalid daylight configuration');
    }

    return {
        mainColor,
        intensity,
    };
};

const night = (config: LowLevelConfig) => ({
    color: config.night.color,
    intensity: config.night.intensity / 100,
});

const timings = (config: LowLevelConfig) => ({
    dawnBeginsAt: config.daylight.red.delay,
    duskEndsAt: (config.daylight.red.delay + config.daylight.red.duration + 2 * twilightDuration),
});

const twilight = (config: LowLevelConfig) => ({
    redLevel: Math.min(1, Math.max(0, (config.daylight.white.delay - config.daylight.red.delay) / twilightDuration)),
});

const channels = (config: LowLevelConfig, status: LampStatus) => {
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

const temperature = (config: LowLevelConfig) => ({ ...config.temperature });

const fan = (config: LowLevelConfig) => ({ ...config.fan });

const master = (config: LowLevelConfig) => config.mode === 'master';

const features = (config: LowLevelConfig, status: LampStatus): Features => {
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

export const collect = (config: LowLevelConfig, status: LampStatus) => {
    const convert = collectTarget({ daylight, night, timings, twilight, channels, temperature, fan, master, features });
    const { config: bugFreeConfig, bugs } = blockOnFetch(config, status);
    return { ...convert(bugFreeConfig, status), bugs };
};
