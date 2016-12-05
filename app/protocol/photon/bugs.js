import { flowRight as compose } from 'lodash';
import * as lamps from './lamps';

const BUG_EARLY_DUSK = 'EARLY_DUSK';

const maskEarlyDusk = next => (config, status) => {
    const model = lamps.detectModel(status);

    // This problem appears on first generation Pro and Compact lamps
    if (!(model === lamps.PRO || model === lamps.COMPACT)) {
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


const supportEarlyDusk = next => (config, bugs) => {
    if (!bugs.indexOf(BUG_EARLY_DUSK) < 0) {
        return next(config, bugs);
    }

    // The lamp doesn't keep in consideration the duration of one slope value,
    // therefore we add one slope to every duration
    const patchedConfig = config;
    patchedConfig.daylight.white.duration += patchedConfig.daylight.white.slope;
    patchedConfig.daylight.red.duration += patchedConfig.daylight.red.slope;
    patchedConfig.daylight.green.duration += patchedConfig.daylight.green.slope;
    patchedConfig.daylight.blue.duration += patchedConfig.daylight.blue.slope;

    return next(patchedConfig, bugs);
};

export const maskOnFetch = compose(maskEarlyDusk);

export const supportOnSave = compose(supportEarlyDusk);
