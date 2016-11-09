/*
 * eslint-disable no-unused-vars
 * @flow
 */

import EError from 'app/utils/error';
import { blockOnFetch } from './bugs';
import { twilightDuration, floorIntensity, compactChannels } from './constants';
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
    let channels = config.channels;
  // if compact, return just 6 channels
    const isCompact = Math.floor(status.firmwareVersion / 100) === 2;
    if (isCompact) {
        channels = compactChannels.map(idx => config.channels[idx]);
    }
    return channels.map((c) => {
        if (c === 'off') return { color: 'white', enabled: false };
        return { color: c, enabled: true };
    });
};

const temperature = (config: LowLevelConfig) => ({ ...config.temperature });

const fan = (config: LowLevelConfig) => ({ ...config.fan });

const master = (config: LowLevelConfig) => config.mode === 'master';

const features = (config: LowLevelConfig, status: LampStatus): Features => {
    switch (status.productId) {
    case 16:
        // PlanetPRO v1 and Compact
        {
            const features: Features = {
                CHANNEL_MAPPING: true,
                CLOCK_SYNC: true,
                FAN_CONFIG: true,
                TEMPERATURE_CONFIG: true,
                MASTER_SWITCH: true,
                DEMO_MODE: true,
            };
            const isCompact = Math.floor(status.firmwareVersion / 100) === 2;
            if (isCompact) features.CHANNEL_MAPPING_COMPACT = true;
            return features;
        }
    case 562:
        // PlanetPRO v2
        return {
            CHANNEL_MAPPING: true,
            CLOCK_SYNC: true,
            FAN_CONFIG: true,
            TEMPERATURE_CONFIG: true,
            DEMO_MODE: true,
        };
    case 564:
        // PlanetStella
        return {
            CLOCK_SYNC: true,
            DEMO_MODE: true,
        };
    default:
        return {};
    }
};

export const collect = (config: LowLevelConfig, status: LampStatus) => {
    const convert = collectTarget({ daylight, night, timings, twilight, channels, temperature, fan, master, features });
    const { config: bugFreeConfig, bugs } = blockOnFetch(config, status);
    return { ...convert(bugFreeConfig, status), bugs };
};
