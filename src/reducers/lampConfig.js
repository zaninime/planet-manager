import { combineReducers } from 'redux';
import { push } from 'react-router-redux';
import daylight, * as fromDaylight from './daylight';
import timings, * as fromTimings from './timings';
import twilight, * as fromTwilight from './twilight';
import night, * as fromNight from './night';
import temperature, * as fromTemperature from './temperature';
import fan, * as fromFan from './fan';
import channels, * as fromChannels from './channels';
import master from './master';
import { setMessage } from './error';
import wifi, * as fromWifi from './wifi';
import caps, * as fromCaps from './caps';
import * as fromManaged from './managed';
import * as fromAddressing from './addressing';
import configSaved, * as fromConfigSaved from './configSaved';
import fieldError, * as fromFieldError from 'reducers/fieldError';
import sleep from 'utils/sleep';
import { wifiToProtocolFormat } from 'utils/addressing';

import { collect } from 'protocol/photon/collector';
import { emit } from 'protocol/photon/emitter';
import {
  fetchConfig,
  fetchStatus,
  saveConfig as apiSaveConfig,
  saveClock,
  saveWifiConfig
} from 'protocol/api';

export const LOAD_START = 'lampConfig/LOAD_START';
export const LOAD_COMPLETED = 'lampConfig/LOAD_COMPLETED';

const singleConfig = combineReducers({
  daylight,
  night,
  timings,
  twilight,
  channels,
  temperature,
  fan,
  master,
  caps,
  wifi,
  configSaved,
  fieldError
});

const configs = (state = {}, action) => {
  switch (action.type) {
  // yeah, just a few...
  case LOAD_COMPLETED:
  case fromDaylight.SET_COLOR:
  case fromDaylight.SET_INTENSITY:
  case fromTimings.SET_TIMER_START:
  case fromTimings.SET_TIMER_END:
  case fromTwilight.SET_RED_LEVEL:
  case fromNight.SET_COLOR:
  case fromNight.SET_INTENSITY:
  case fromTemperature.SET_START_TEMPERATURE:
  case fromFan.SET_MAX_SPEED:
  case fromChannels.NEXT_COLOR:
  case fromChannels.TOGGLE_ENABLE:
  case fromChannels.TOGGLE_DISABLE:
  case fromWifi.SET_MODE:
  case fromWifi.SET_SSID:
  case fromManaged.SET_PASSWORD:
  case fromManaged.TOGGLE_DHCP:
  case fromAddressing.SET_IP:
  case fromAddressing.SET_NETMASK:
  case fromAddressing.SET_GATEWAY:
  case fromConfigSaved.SAVE_START:
  case fromConfigSaved.SAVE_COMPLETED:
  case fromFieldError.SET_ERROR:
    return { ...state, [action.lampId]: singleConfig(state[action.lampId], action) };
  default:
    return state;
  }
};

export default configs;

// action creators
export const loadConfig = (lampId) => (dispatch) => {
  dispatch({type: LOAD_START, lampId});
  (async (lampId, dispatch) => {
    let status = {}, config = {}, error = false;

    try {
      status = await fetchStatus(lampId);
      await sleep(1000);
      config = await fetchConfig(lampId);
    }
    catch (e) {
      error = true;
      if (e.message !== undefined)
        dispatch(setMessage(e.message));
      else
        dispatch(setMessage("Unknown"));
    }

    return { status, config, error };
  })(lampId, dispatch).then(({ config, status, error }) => {
    if (!error) {
      config = collect(config, status);
      dispatch({type: LOAD_COMPLETED, lampId, data: config});
      dispatch(push(`/${lampId}/day/`));
    }
  });
};

export const saveConfig = (lampId, state) => (dispatch) => {
  dispatch(fromConfigSaved.startSaving(lampId));
  let configSaved = isLampConfigSaved(state);
  const wifiConfigSaved = isWifiConfigSaved(state);
  (async (lampId, state) => {
    await saveClock(lampId, new Date());
    await sleep(1000);
    const config = await emit(state, state.caps);
    await apiSaveConfig(lampId, config);
    await sleep(1000);

    configSaved = true;

    if (!wifiConfigSaved) {
      const wifiConfig = await wifiToProtocolFormat(state.wifi);
      await saveWifiConfig(lampId, wifiConfig);
    }
  })(lampId, state).then(() => {
    dispatch(fromConfigSaved.setConfigSaved(lampId));

    // if wifi has changed then redirect
    // done after saving otherwise loading
    // dialog is reopened in home page
    if (!wifiConfigSaved)
      dispatch(push('/'));
  }, err => {
    if (err.message === undefined)
      err.message = "Unknown";

    if (!configSaved && !wifiConfigSaved)
      err.message += ". Retry, lamp and wifi configurations haven't been saved!";
    else if (!configSaved)
      err.message += ". Retry, lamp configuration hasn't been saved!";
    else if (!wifiConfigSaved)
      err.message += ". Retry, wifi configuration hasn't been saved!";

    dispatch(setMessage(err.message));
  });
};

// selectors

// channels
export const getStripCurrentColor = (state, stripNumber) => fromChannels.getStripCurrentColor(state.channels, stripNumber);
export const getStripIsEnabled = (state, stripNumber) => fromChannels.getStripIsEnabled(state.channels, stripNumber);
export const getChannelsCount = (state) => fromChannels.getChannelsCount(state.channels);

// daylight
export const getDayColor = (state) => fromDaylight.getDayColor(state.daylight);
export const getDayColorIntensity = (state) => fromDaylight.getDayColorIntensity(state.daylight);

// timings
export const getSunriseTime = (state) => fromTimings.getSunriseTime(state.timings);
export const getSunsetTime = (state) => fromTimings.getSunsetTime(state.timings);

// twilight
export const getTwilightValue = (state) => fromTwilight.getTwilightValue(state.twilight);

// night
export const getNightColor = (state) => fromNight.getNightColor(state.night);
export const getNightColorIntensity = (state) => fromNight.getNightColorIntensity(state.night);

// temperature
export const getFanStartTemperature = (state) => fromTemperature.getFanStartTemperature(state.temperature);

// fan
export const getFanMaxSpeed = (state) => fromFan.getFanMaxSpeed(state.fan);

// caps
export const isChannelMappingAvailable = (state) => fromCaps.isChannelMappingAvailable(state.caps);
export const isFanConfigAvailable = (state) => fromCaps.isFanConfigAvailable(state.caps);
export const isTemperatureConfigAvailable = (state) => fromCaps.isTemperatureConfigAvailable(state.caps);

// wifi
export const getMode = (state) => fromWifi.getMode(state.wifi);
export const getSsid = (state) => fromWifi.getSsid(state.wifi);
export const getPassword = (state) => fromWifi.getPassword(state.wifi);
export const isDhcpEnabled = (state) => fromWifi.isDhcpEnabled(state.wifi);
export const getIp = (state) => fromWifi.getIp(state.wifi);
export const getNetmask = (state) => fromWifi.getNetmask(state.wifi);
export const getGateway = (state) => fromWifi.getGateway(state.wifi);

// configSaved
export const isConfigSaved = (state) => fromConfigSaved.isConfigSaved(state.configSaved);
export const isLampConfigSaved = (state) => fromConfigSaved.isLampConfigSaved(state.configSaved);
export const isWifiConfigSaved = (state) => fromConfigSaved.isWifiConfigSaved(state.configSaved);

// fieldError
export const getFieldError = (state) => fromFieldError.getFieldError(state.fieldError);
