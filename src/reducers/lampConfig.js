import { combineReducers } from 'redux';
import channels, * as fromChannels from './channels';
import daylight from './daylight';
import night from './night';
import timings from './timings';
import twilight from './twilight';
import temperature from './temperature';
import fan from './fan';
import master from './master';

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
    return {...state, [action.lampId]: singleConfig(state.lampId, action)};
  default:
    return state;
  }
};

export default configs;

// action creators
export const loadConfig = (lampId) => (dispatch) => {
  dispatch({type: LOAD_START, lampId});
  (async function() {
    const status = await fetchStatus(lampId);
    const config = await fetchConfig(lampId);
    return {status, config};
  })(lampId, dispatch).then(({config, status}) => {
    config = collect(config, status);
    dispatch({type: LOAD_COMPLETED, lampId, data: config});
  });
};

// selectors

// channels
export const getStripCurrentColor = (state, lampId, stripNumber) => fromChannels.getStripCurrentColor(state[lampId].channels, stripNumber);
export const getStripIsEnabled = (state, lampId, stripNumber) => fromChannels.getStripIsEnabled(state[lampId].channels, stripNumber);
