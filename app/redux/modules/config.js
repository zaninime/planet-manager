import { combineReducers } from 'redux';
import daylight, * as fromDaylight from './daylight';
import timings, * as fromTimings from './timings';
import twilight, * as fromTwilight from './twilight';
import night, * as fromNight from './night';
import temperature, * as fromTemperature from './temperature';
import fan, * as fromFan from './fan';
import channels, * as fromChannels from './channels';
import master, * as fromMaster from './master';

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
export const startLoading = lampId => ({ type: LOAD_START, payload: { lampId } });
export const completeLoading = (lampId, data, wifi) => ({ type: LOAD_COMPLETED, payload: { lampId, data, wifi } });

// selectors

/* eslint-disable max-len */

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

// master
export const getOperationMode = state => fromMaster.getOperationMode(state.master);

/* eslint-enable max-len */
