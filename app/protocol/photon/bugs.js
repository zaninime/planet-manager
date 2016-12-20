import { flowRight as compose } from 'lodash';
import * as lamps from './lamps';

export const BUG_EARLY_DUSK = 'EARLY_DUSK';

const maskEarlyDusk = next => (config, status) => {
    const model = lamps.detectModel(status);

    // This problem appears on all firmware versions < 200 (Pro, Compact and v2 models)
    const isLampAffected =
        model === lamps.PRO ||
        model === lamps.COMPACT ||
        model === lamps.PRO_V2 ||
        model === lamps.COMPACT_V2;
    const isFirmwareAffected = status.firmwareVersion < 200;
    const isBugPresent = isLampAffected && isFirmwareAffected;

    if (!isBugPresent) {
        return next(config, status);
    }

    // The lamp doesn't keep in consideration the duration of one slope value,
    // therefore we substract one slope to every duration
    const patchedConfig = config;
    patchedConfig.daylight.white.duration -= patchedConfig.daylight.white.slope;
    patchedConfig.daylight.red.duration -= patchedConfig.daylight.red.slope;
    patchedConfig.daylight.green.duration -= patchedConfig.daylight.green.slope;
    patchedConfig.daylight.blue.duration -= patchedConfig.daylight.blue.slope;

    const result = next(patchedConfig, status);
    result.bugs.push(BUG_EARLY_DUSK);
    return result;
};


const supportEarlyDusk = next => (config, features, bugs) => {
    if (bugs.indexOf(BUG_EARLY_DUSK) < 0) {
        return next(config, features, bugs);
    }

    const lowConfig = next(config, features, bugs);

    // The lamp doesn't keep in consideration the duration of one slope value,
    // therefore we add one slope to every duration
    lowConfig.daylight.white.duration += lowConfig.daylight.white.slope;
    lowConfig.daylight.red.duration += lowConfig.daylight.red.slope;
    lowConfig.daylight.green.duration += lowConfig.daylight.green.slope;
    lowConfig.daylight.blue.duration += lowConfig.daylight.blue.slope;

    return lowConfig;
};

// Signature: maskOnFetch :: next -> (lowConfig, status) -> { highConfig, features, bugs }
export const maskOnFetch = compose(maskEarlyDusk);

// Signature: supportOnSave :: next -> (highConfig, features, bugs) -> lowConfig
export const supportOnSave = compose(supportEarlyDusk);
