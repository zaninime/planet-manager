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
import { setMessage } from './connectError';

// import EError from 'utils/error';
// import { IncompatibleConfigError } from 'protocol/photon/collector';
import { collect } from 'protocol/photon/collector';
import { fetchConfig, fetchStatus } from 'protocol/plug';

export const LOAD_COMPLETED = 'lampConfig/LOAD_COMPLETED';
export const LOAD_START = 'lampConfig/LOAD_START';

const caps = (state = {}, action) => {
  switch (action.type) {
  case LOAD_COMPLETED:
    return {bugs: action.data.bugs, features: action.data.features};
  default:
    return state;
  }
};

const singleConfig = combineReducers({
  daylight,
  night,
  timings,
  twilight,
  channels,
  temperature,
  fan,
  master,
  caps
});

const configs = (state = {}, action) => {
  switch (action.type) {
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
    return {...state, [action.lampId]: singleConfig(state[action.lampId], action)};
  default:
    return state;
  }
};

export default configs;

// action creators
export const loadConfig = (lampId) => (dispatch) => {
  dispatch({type: LOAD_START, lampId});
  (async function() {
    let status = {}, config = {}, error = false;

    try {
      status = await fetchStatus(lampId);
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
  })(lampId, dispatch).then(({config, status, error}) => {
    if (!error) {
      config = collect(config, status);
      dispatch({type: LOAD_COMPLETED, lampId, data: config});
      dispatch(push(`/${lampId}/day/`));
    }
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
