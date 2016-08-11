import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import lampConfig, * as fromLampConfig from './lampConfig';
import discovery from './discovery';

const rootReducer = combineReducers({
  routing: routerReducer,
  lampConfig,
  discovery
});

export default rootReducer;

// selectors

// lampConfig
export const getStripCurrentColor = (state, stripNumber) => fromLampConfig.getStripCurrentColor(state.lampConfig, stripNumber);
export const getStripIsEnabled = (state, stripNumber) => fromLampConfig.getStripIsEnabled(state.lampConfig, stripNumber);