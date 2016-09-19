import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import lampConfig, * as fromLampConfig from './lampConfig';
import discovery, * as fromDiscovery from './discovery';
import connectError, * as fromConnectError from './connectError';

const rootReducer = combineReducers({
  routing: routerReducer,
  lampConfig,
  discovery,
  connectError
});

export default rootReducer;

// selectors

// discovery
export const getRecentLamps = (state) => fromDiscovery.getRecentLamps(state.discovery);

// channels
export const getStripCurrentColor = (state, stripNumber, lampId) => fromLampConfig.getStripCurrentColor(state.lampConfig[lampId], stripNumber);
export const getStripIsEnabled = (state, stripNumber, lampId) => fromLampConfig.getStripIsEnabled(state.lampConfig[lampId], stripNumber);
export const getChannelsCount = (state, lampId) => fromLampConfig.getChannelsCount(state.lampConfig[lampId]);

// daylight
export const getDayColor = (state, lampId) => fromLampConfig.getDayColor(state.lampConfig[lampId]);
export const getDayColorIntensity = (state, lampId) => fromLampConfig.getDayColorIntensity(state.lampConfig[lampId]);

// timings
export const getSunriseTime = (state, lampId) => fromLampConfig.getSunriseTime(state.lampConfig[lampId]);
export const getSunsetTime = (state, lampId) => fromLampConfig.getSunsetTime(state.lampConfig[lampId]);

// twilight
export const getTwilightValue = (state, lampId) => fromLampConfig.getTwilightValue(state.lampConfig[lampId]);

// daylight
export const getNightColor = (state, lampId) => fromLampConfig.getNightColor(state.lampConfig[lampId]);
export const getNightColorIntensity = (state, lampId) => fromLampConfig.getNightColorIntensity(state.lampConfig[lampId]);

// temperature
export const getFanStartTemperature = (state, lampId) => fromLampConfig.getFanStartTemperature(state.lampConfig[lampId]);

// fan
export const getFanMaxSpeed = (state, lampId) => fromLampConfig.getFanMaxSpeed(state.lampConfig[lampId]);

// connectError
export const isErrorEncountered = (state) => fromConnectError.isErrorEncountered(state.connectError);
export const getMessage = (state) => fromConnectError.getMessage(state.connectError);
