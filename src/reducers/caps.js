import { LOAD_COMPLETED } from './lampConfig';

const caps = (state = {}, action) => {
  switch (action.type) {
  case LOAD_COMPLETED:
    return { bugs: action.data.bugs, features: action.data.features };
  default:
    return state;
  }
};

export default caps;

// selectors
export const isChannelMappingAvailable = (state) => state.features['CHANNEL_MAPPING'];
export const isFanConfigAvailable = (state) => state.features['FAN_CONFIG'];
export const isTemperatureConfigAvailable = (state) => state.features['TEMPERATURE_CONFIG'];
export const isClockSyncAvailable = (state) => state.features['CLOCK_SYNC'];
export const isMasterSwicthAvailable = (state) => state.features['MASTER_SWITCH'];
export const isDemoModeAvailable = (state) => state.features['DEMO_MODE'];
