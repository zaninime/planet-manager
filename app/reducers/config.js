import { combineReducers } from 'redux';
import { push } from 'react-router-redux';
import Rx from 'rxjs/Rx';

import { wifiToProtocolFormat, wifiToReducerFormat } from 'app/utils/addressing';
import { collect } from 'app/protocol/photon/collector';
import { emit } from 'app/protocol/photon/emitter';
import {
  fetchConfig,
  fetchStatus,
  fetchWifiConfig,
  saveConfig as apiSaveConfig,
  saveClock,
  saveWifiConfig,
} from 'app/protocol/api';

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
    master,
});

export default config;

// action creators
export const startLoading = lampId => ({ type: LOAD_START, lampId });
export const completeLoading = (lampId, data, wifi) => ({ type: LOAD_COMPLETED, lampId, data, wifi });

// epics
export const startLoadingEpic = action$ =>
  action$.ofType(LOAD_START)
  .mergeMap(action =>
    Rx.Observable.from([
        Rx.Observable.of(action.lampId).mergeMap(lampId => fetchStatus(lampId)).delay(1000),
        Rx.Observable.of(action.lampId).mergeMap(lampId => fetchConfig(lampId)).delay(1000),
        Rx.Observable.of(action.lampId).mergeMap(lampId => fetchWifiConfig(lampId)),
    ])
    .concatAll()
    .toArray()
    .map(x => completeLoading(action.lampId, collect(x[1], x[0]), wifiToReducerFormat(x[2])))
    .catch(error => Rx.Observable.of(setMessage(error.message || 'Unknown'))),
  );

export const completeLoadingEpic = action$ =>
  action$.ofType(LOAD_COMPLETED)
    .map(action => push(`/${action.lampId}/day/`));

export const startSavingEpic = (action$, store) =>
  action$.ofType(fromSaved.SAVE_START)
    .mergeMap(action =>
      Rx.Observable.of(action).map(() => {
          const state = store.getState().lamps[action.lampId];
          return {
              clock: new Date(),
              emittedConfig: emit(state.config, state.caps),
              wifi: !fromLamps.isWifiConfigSaved(state) ? wifiToProtocolFormat(state.wifi) : undefined,
          };
      })
      .mergeMap(data =>
        Rx.Observable.from([
            Rx.Observable.of(data).mergeMap(({ clock }) => saveClock(action.lampId, clock)).delay(1000),
            Rx.Observable.of(data).mergeMap(({ emittedConfig }) => apiSaveConfig(action.lampId, emittedConfig)),
            data.wifi ?
            Rx.Observable.of(data).delay(1000).mergeMap(({ wifi }) => saveWifiConfig(action.lampId, wifi)) :
            Rx.Observable.of(true),
        ]),
      )
      .concatAll()
      .toArray()
      .mergeMap(x => [
          ...[fromSaved.setConfigSaved(action.lampId)],
          x[2] ? undefined : push('/'),
      ])
      .filter(x => x !== undefined)
      .catch((error) => {
          const e = error;
          if (e.message !== undefined) {
              e.message += '. Your configurations may not have been saved!';
          }

          return Rx.Observable.of(setMessage(e.message || 'Unknown'));
      }),
    );

/* eslint-disable max-len */

// selectors

// channels
export const getStripCurrentColor = (state, stripNumber) => fromChannels.getStripCurrentColor(state.channels, stripNumber);
export const getStripIsEnabled = (state, stripNumber) => fromChannels.getStripIsEnabled(state.channels, stripNumber);
export const getChannelsCount = state => fromChannels.getChannelsCount(state.channels);

// daylight
export const getDayColor = state => fromDaylight.getDayColor(state.daylight);
export const getDayColorIntensity = state => fromDaylight.getDayColorIntensity(state.daylight);

// timings
export const getSunriseTime = state => fromTimings.getSunriseTime(state.timings);
export const getSunsetTime = state => fromTimings.getSunsetTime(state.timings);

// twilight
export const getTwilightValue = state => fromTwilight.getTwilightValue(state.twilight);

// night
export const getNightColor = state => fromNight.getNightColor(state.night);
export const getNightColorIntensity = state => fromNight.getNightColorIntensity(state.night);

// temperature
export const getFanStartTemperature = state => fromTemperature.getFanStartTemperature(state.temperature);

// fan
export const getFanMaxSpeed = state => fromFan.getFanMaxSpeed(state.fan);

/* eslint-enable max-len */
