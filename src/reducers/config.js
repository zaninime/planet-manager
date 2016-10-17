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
import * as fromSaved from './saved';
import { setMessage } from './error';
import * as fromLamps from './lamps';

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

export const LOAD_START = 'config/LOAD_START';
export const LOAD_COMPLETED = 'config/LOAD_COMPLETED';

const config = combineReducers({
  daylight,
  night,
  timings,
  twilight,
  channels,
  temperature,
  fan,
  master
});

export default config;

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
  dispatch(fromSaved.startSaving(lampId));

  let configSaved = fromLamps.isLampConfigSaved(state);
  const wifiConfigSaved = fromLamps.isWifiConfigSaved(state);

  (async (lampId, state) => {
    const { config, wifi, caps } = state;

    await saveClock(lampId, new Date());
    await sleep(1000);
    const lampConfig = await emit(config, caps);
    await apiSaveConfig(lampId, lampConfig);
    await sleep(1000);

    configSaved = true;

    if (!wifiConfigSaved) {
      const wifiConfig = await wifiToProtocolFormat(wifi);
      await saveWifiConfig(lampId, wifiConfig);
    }
  })(lampId, state).then(() => {
    dispatch(fromSaved.setConfigSaved(lampId));

    // if wifi has changed then redirect to the home page,
    // this is done after saving otherwise the loading
    // dialog is reopened in the home page
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
