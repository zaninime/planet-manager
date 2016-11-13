/* @flow */
import type { LampStatus } from './types';

export const PRO = 'PlanetPRO';
export const PRO_V2 = 'PlanetPRO mkII';
export const COMPACT = 'PlanetCompact';
export const STELLA = 'PlanetStella';

type LampModel = 'PlanetPRO' | 'PlanetPRO mkII' | 'PlanetCompact' | 'PlanetStella';

export const detectModel = (status: LampStatus): LampModel => {
    switch (status.productId) {
    case 16:
        {
            const isCompact = Math.floor(status.firmwareVersion / 100) === 2;
            if (isCompact) return COMPACT;
            return PRO;
        }
    case 101:
        return PRO_V2;
    case 100:
        return STELLA;
    default:
        throw new Error(`Lamp model ${status.productId} is not recognized.`);
    }
};
