import { LOAD_COMPLETED } from './config';

const caps = (state = {}, action) => {
    switch (action.type) {
    case LOAD_COMPLETED:
        return { bugs: action.payload.data.bugs, features: action.payload.data.features };
    default:
        return state;
    }
};

export default caps;

// selectors
export const isChannelMappingAvailable = state => !!state.features.CHANNEL_MAPPING;
export const isFanConfigAvailable = state => !!state.features.FAN_CONFIG;
export const isTemperatureConfigAvailable = state => !!state.features.TEMPERATURE_CONFIG;
export const isClockSyncAvailable = state => !!state.features.CLOCK_SYNC;
export const isMasterSwicthAvailable = state => !!state.features.MASTER_SWITCH;
export const isDemoModeAvailable = state => !!state.features.DEMO_MODE;
export const isFeatureAvailable = (state, feature) => !!state.features[feature];
