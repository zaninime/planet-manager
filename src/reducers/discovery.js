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

// action creators
export const receiveBeacon = (address, port) => ({type: 'DISCOVERY_BEACON_RECEIVED', address, port, time: new Date()});

// selectors
export const getRecentLamps = (state) => {
  const ids = state.ids;
  const byId = state.byId;

  return (
    ids.map(id => {
      const lamp = byId[id];
      lamp.id = id;

      const twentySeconds = 20 * 1000; // ms

      if (lamp !== undefined && (new Date() - lamp.lastSeen) < twentySeconds)
        return lamp;
    })
  );
};
