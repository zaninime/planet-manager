import { combineReducers } from 'redux';
import { push } from 'react-router-redux';
import Rx from 'rxjs/Rx';

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

import { wifiToProtocolFormat, wifiToReducerFormat } from 'utils/addressing';
import { collect } from 'protocol/photon/collector';
import { emit } from 'protocol/photon/emitter';
import {
  fetchConfig,
  fetchStatus,
  fetchWifiConfig,
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
export const startLoading = (lampId) => ({ type: LOAD_START, lampId });
export const completeLoading = (lampId, data, wifi) => ({ type: LOAD_COMPLETED, lampId, data, wifi });

// epics
export const startLoadingEpic = action$ =>
  action$.ofType(LOAD_START)
    .mergeMap(action =>
        Rx.Observable.from([
          Rx.Observable.of(action.lampId).flatMap((lampId) => fetchStatus(lampId)),
          Rx.Observable.timer(1000),
          Rx.Observable.of(action.lampId).flatMap((lampId) => fetchConfig(lampId)),
          Rx.Observable.timer(1000),
          Rx.Observable.of(action.lampId).flatMap((lampId) => fetchWifiConfig(lampId)),
        ])
        .concatAll()
        .toArray()
        .map(x => completeLoading(action.lampId, collect(x[2], x[0]), wifiToReducerFormat(x[4])))
        .catch(error => Rx.Observable.of(setMessage(error.message || "Unknown")))
    );

export const completeLoadingEpic = action$ =>
  action$.ofType(LOAD_COMPLETED)
    .map(action => push(`/${action.lampId}/day/`));

export const startSavingEpic = (action$, store) => {
  return action$.ofType(fromSaved.SAVE_START)
    .mergeMap(action => {
      const state = store.getState().lamps[action.lampId];
      let configSaved = false;
      let wifiConfigSaved = fromLamps.isWifiConfigSaved(state);

      const getConfigError = (configSaved, wifiConfigSaved) => {
        if (!configSaved && !wifiConfigSaved)
          return ". Retry, lamp and wifi configurations haven't been saved!";
        else if (!configSaved)
          return ". Retry, lamp configuration hasn't been saved!";
        else if (!wifiConfigSaved)
          return ". Retry, wifi configuration hasn't been saved!";
      };

      return Rx.Observable.of(saveClock(action.lampId, new Date()))
        .mergeMap(x => x)
        .mergeMap(() => Rx.Observable.timer(1000))
        .mergeMap(() => apiSaveConfig(action.lampId, emit(state.config, state.caps)))
        .mergeMap(() => Rx.Observable.timer(1000))
        .do(() => configSaved = true)
        .map(() =>
          !wifiConfigSaved ?
          Rx.Observable.of(saveWifiConfig(action.lampId, wifiToProtocolFormat(state.wifi))).mergeMap(x => x) :
          Rx.Observable.empty()
        )
        .do(() => wifiConfigSaved = true)
        .mergeMap(() => [
          ...[fromSaved.setConfigSaved(action.lampId)],
          !fromLamps.isWifiConfigSaved(state) ? push('/') : undefined
        ])
        .filter(x => x !== undefined)
        .catch(error => {
          if (error.message !== undefined)
            error.message = getConfigError(configSaved, wifiConfigSaved);

          return Rx.Observable.of(setMessage(error.message || "Unknown"));
        });
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
