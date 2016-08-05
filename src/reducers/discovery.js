import { combineReducers } from 'redux';
import * as lampId from 'utils/lampId';

const byId = (state = {}, action) => {
  switch (action.type) {
  case 'DISCOVERY_BEACON_RECEIVED': {
    const {address, port, time} = action;
    const id = lampId.encode(address, port);
    return {...state, [id]: {
      address, port,
      lastSeen: time
    }};
  }
  default:
    return state;
  }
};

const ids = (state = [], action) => {
  switch (action.type) {
  case 'DISCOVERY_BEACON_RECEIVED': {
    const {address, port} = action;
    const id = lampId.encode(address, port);
    if (state.indexOf(id) == -1) return [...state, id];
    return state;
  }
  default:
    return state;
  }
};

export default combineReducers({byId, ids});

export const receiveBeacon = (address, port) => ({type: 'DISCOVERY_BEACON_RECEIVED', address, port, time: new Date()});
