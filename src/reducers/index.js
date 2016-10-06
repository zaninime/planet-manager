import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import lampConfig, * as fromLampConfig from './lampConfig';
import discovery, * as fromDiscovery from './discovery';
import error, * as fromConnectError from './error';
import loadingDialogOpen, * as fromLoadingDialogOpen from './loadingDialogOpen';

const rootReducer = combineReducers({
  routing: routerReducer,
  lampConfig,
  discovery,
  error,
  loadingDialogOpen
});

export default rootReducer;

// selectors

// discovery
export const getRecentLamps = (state, now) => fromDiscovery.getRecentLamps(state.discovery, now);

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

// caps
export const isChannelMappingAvailable = (state, lampId) => fromLampConfig.isChannelMappingAvailable(state.lampConfig[lampId]);
export const isFanConfigAvailable = (state, lampId) => fromLampConfig.isFanConfigAvailable(state.lampConfig[lampId]);
export const isTemperatureConfigAvailable = (state, lampId) => fromLampConfig.isTemperatureConfigAvailable(state.lampConfig[lampId]);

// wifi
export const getMode = (state, lampId) => fromLampConfig.getMode(state.lampConfig[lampId]);
export const getSsid = (state, lampId) => fromLampConfig.getSsid(state.lampConfig[lampId]);
export const getPassword = (state, lampId) => fromLampConfig.getPassword(state.lampConfig[lampId]);
export const isDhcpEnabled = (state, lampId) => fromLampConfig.isDhcpEnabled(state.lampConfig[lampId]);
export const getIp = (state, lampId) => fromLampConfig.getIp(state.lampConfig[lampId]);
export const getNetmask = (state, lampId) => fromLampConfig.getNetmask(state.lampConfig[lampId]);
export const getGateway = (state, lampId) => fromLampConfig.getGateway(state.lampConfig[lampId]);

// configSaved
export const isConfigSaved = (state, lampId) => fromLampConfig.isConfigSaved(state.lampConfig[lampId]);
export const isWifiConfigSaved = (state, lampId) => fromLampConfig.isWifiConfigSaved(state.lampConfig[lampId]);

// fieldError
export const getFieldError = (state, lampId) => fromLampConfig.getFieldError(state.lampConfig[lampId]);

// error
export const isThrown = (state) => fromConnectError.isThrown(state.error);
export const getMessage = (state) => fromConnectError.getMessage(state.error);

// loadingDialogOpen
export const isLoadingDialogOpen = (state) => fromLoadingDialogOpen.isLoadingDialogOpen(state.loadingDialogOpen);
