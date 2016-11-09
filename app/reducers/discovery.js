import { combineReducers } from 'redux';
import * as lampId from 'app/utils/lampId';

const BEACON_RECEIVED = 'discovery/BEACON_RECEIVED';

const byId = (state = {}, action) => {
    switch (action.type) {
    case BEACON_RECEIVED: {
        const { address, port, time } = action;
        const id = lampId.encode(address, port);
        return {
            ...state,
            [id]: {
                address,
                port,
                lastSeen: time,
            },
        };
    }
    default:
        return state;
    }
};

const ids = (state = [], action) => {
    switch (action.type) {
    case BEACON_RECEIVED: {
        const { address, port } = action;
        const id = lampId.encode(address, port);
        if (state.indexOf(id) === -1) return [...state, id];
        return state;
    }
    default:
        return state;
    }
};

export default combineReducers({ byId, ids });

// action creators
export const receiveBeacon = (address, port) => ({ type: BEACON_RECEIVED, address, port, time: new Date() });

// selectors
export const getRecentLamps = (state, now) => (
    state.ids.map((id) => {
        const lamp = state.byId[id];
        lamp.id = id;

        const twentySeconds = 20 * 1000; // ms

        if (now - lamp.lastSeen < twentySeconds) {
            return lamp;
        }

        return undefined;
    }).filter(x => x)
);
