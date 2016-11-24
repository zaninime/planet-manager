import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import lamps, * as fromLamps from './lamps';
import discovery, * as fromDiscovery from './discovery';
import error, * as fromError from './error';
import ui, * as fromUi from './ui';

// reducer
const rootReducer = combineReducers({
    routing: routerReducer,
    lamps,
    discovery,
    error,
    ui,
});

export default rootReducer;

// selectors

/* eslint-disable max-len */

// config
export const getStripCurrentColor = (state, stripNumber, lampId) => fromLamps.getStripCurrentColor(state.lamps[lampId], stripNumber);
export const getStripIsEnabled = (state, stripNumber, lampId) => fromLamps.getStripIsEnabled(state.lamps[lampId], stripNumber);
export const getChannelsCount = (state, lampId) => fromLamps.getChannelsCount(state.lamps[lampId]);
export const getDayColor = (state, lampId) => fromLamps.getDayColor(state.lamps[lampId]);
export const getDayColorIntensity = (state, lampId) => fromLamps.getDayColorIntensity(state.lamps[lampId]);
export const getSunriseTime = (state, lampId) => fromLamps.getSunriseTime(state.lamps[lampId]);
export const getSunsetTime = (state, lampId) => fromLamps.getSunsetTime(state.lamps[lampId]);
export const getTwilightValue = (state, lampId) => fromLamps.getTwilightValue(state.lamps[lampId]);
export const getNightColor = (state, lampId) => fromLamps.getNightColor(state.lamps[lampId]);
export const getNightColorIntensity = (state, lampId) => fromLamps.getNightColorIntensity(state.lamps[lampId]);
export const getFanStartTemperature = (state, lampId) => fromLamps.getFanStartTemperature(state.lamps[lampId]);
export const getFanMaxSpeed = (state, lampId) => fromLamps.getFanMaxSpeed(state.lamps[lampId]);
export const isChannelMappingAvailable = (state, lampId) => fromLamps.isChannelMappingAvailable(state.lamps[lampId]);
export const isFanConfigAvailable = (state, lampId) => fromLamps.isFanConfigAvailable(state.lamps[lampId]);
export const isMasterSwitchAvailable = (state, lampId) => fromLamps.isMasterSwitchAvailable(state.lamps[lampId]);
export const isTemperatureConfigAvailable = (state, lampId) => fromLamps.isTemperatureConfigAvailable(state.lamps[lampId]);
export const isFeatureAvailable = (state, feature, lampId) => fromLamps.isFeatureAvailable(state.lamps[lampId], feature);
export const getMode = (state, lampId) => fromLamps.getMode(state.lamps[lampId]);
export const getSsid = (state, lampId) => fromLamps.getSsid(state.lamps[lampId]);
export const getPassword = (state, lampId) => fromLamps.getPassword(state.lamps[lampId]);
export const isDhcpEnabled = (state, lampId) => fromLamps.isDhcpEnabled(state.lamps[lampId]);
export const getIp = (state, lampId) => fromLamps.getIp(state.lamps[lampId]);
export const getNetmask = (state, lampId) => fromLamps.getNetmask(state.lamps[lampId]);
export const getGateway = (state, lampId) => fromLamps.getGateway(state.lamps[lampId]);
export const isConfigSaved = (state, lampId) => fromLamps.isConfigSaved(state.lamps[lampId]);
export const isLampConfigSaved = (state, lampId) => fromLamps.isLampConfigSaved(state.lamps[lampId]);
export const isWifiConfigSaved = (state, lampId) => fromLamps.isWifiConfigSaved(state.lamps[lampId]);
export const getOperationMode = (state, lampId) => fromLamps.getOperationMode(state.lamps[lampId]);

// discovery
export const getRecentLamps = (state, now) => fromDiscovery.getRecentLamps(state.discovery, now);

// error
export const isThrown = state => fromError.isThrown(state.error);
export const getErrorContent = state => fromError.getErrorContent(state.error);

// ui
export const getFieldError = state => fromUi.getFieldError(state.ui);
export const isLoadingDialogOpen = state => fromUi.isLoadingDialogOpen(state.ui);

/* eslint-enable max-len */
