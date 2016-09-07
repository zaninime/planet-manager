import { LOAD_COMPLETED } from './lampConfig';

const colors = ['white', 'red', 'green', 'blue'];

// actions
export const NEXT_COLOR = "lampConfig/channels/CONFIG_NEXT_STRIP_COLOR";
export const TOGGLE_ENABLE = "lampConfig/channels/CONFIG_TOGGLE_STRIP_ENABLE";
export const TOGGLE_DISABLE = "lampConfig/channels/CONFIG_TOGGLE_STRIP_DISABLE";

// reducer
const channel = (state = {color: 'white', enabled: true}, action) => {
  switch (action.type) {
  case NEXT_COLOR:
    return {...state, color: colors[(colors.indexOf(state.color) + 1) % colors.length]};
  case TOGGLE_ENABLE:
    return {...state, enabled: true};
  case TOGGLE_DISABLE:
    return {...state, enabled: false};
  default:
    return state;
  }
};

const channels = (state = [], action) => {
  switch (action.type) {
  case LOAD_COMPLETED:
    return action.data.channels;
  case NEXT_COLOR:
  case TOGGLE_ENABLE:
  case TOGGLE_DISABLE:
    return [
      ...state.slice(0, (action.idx - 1)),
      channel(state[action.idx - 1], action),
      ...state.slice(action.idx)];
  default:
    return state;
  }
};

export default channels;

// action creators
export const nextStripColor = (idx, lampId) => ({ type: NEXT_COLOR, idx, lampId });
export const enableStrip = (idx, lampId) => ({ type: TOGGLE_ENABLE, idx, lampId });
export const disableStrip = (idx, lampId) => ({ type: TOGGLE_DISABLE, idx, lampId });

// selectors
export const getStripCurrentColor = (state, stripNumber) => state[stripNumber - 1].color;
export const getStripIsEnabled = (state, stripNumber) => state[stripNumber - 1].enabled;
export const getChannelsCount = (state) => state.length;
