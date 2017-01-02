/* @flow */
import type { LampStatus } from './types';

export const PRO = 'PlanetPRO';
export const PRO_V2 = 'PlanetPRO mk.II';
export const COMPACT = 'PlanetCompact';
export const COMPACT_V2 = 'PlanetCompact mk.II';
export const STELLA = 'PlanetStella';

type LampModel = 'PlanetPRO' | 'PlanetPRO mk.II' | 'PlanetCompact' | 'PlanetCompact mk.II' | 'PlanetStella';

export const detectModel = (status: LampStatus): LampModel => {
    switch (status.productId) {
    case 16:
    case 101:
        {
            const isCompact = status.firmwareVersion % 2 === 1;
            const isV2 = status.firmwareVersion > 117;
            if (isCompact) {
                if (isV2) return COMPACT_V2;
                return COMPACT;
            }
            if (isV2) return PRO_V2;
            return PRO;
        }
    case 100:
        return STELLA;
    default:
        throw new Error(`Lamp model ${status.productId} is not recognized.`);
    }
};
