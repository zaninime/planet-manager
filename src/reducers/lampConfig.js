import { combineReducers } from 'redux';
import channelMapping, * as fromChannelMapping from './channelMapping';
import timer from './timer';

export default combineReducers({
  channelMapping,
  timer
});

// selectors

// channelMapping
export const getStripCurrentColor = (state, stripNumber) => fromChannelMapping.getStripCurrentColor(state.channelMapping, stripNumber);
export const getStripIsEnabled = (state, stripNumber) => fromChannelMapping.getStripIsEnabled(state.channelMapping, stripNumber);
