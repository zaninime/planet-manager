import station, * as fromStation from './station';
import ibss, * as fromIbss from './ibss';
import * as fromAddressing from './addressing';
import { LOAD_COMPLETED } from './config';

// actions
export const SET_MODE = 'lampConfig/wifi/SET_MODE';
export const SET_SSID = 'lampConfig/wifi/SET_SSID';

/* eslint-disable no-use-before-define */

const wifi = (state = { mode: 'ibss', ibss: { }, station: { } }, action) => {
    switch (action.type) {
    case LOAD_COMPLETED:
        return action.payload.wifi;
    case SET_MODE:
        return { ...state, mode: action.payload.mode };
    case SET_SSID:
    case fromStation.SET_PASSWORD:
    case fromStation.TOGGLE_DHCP:
    case fromAddressing.SET_IP:
    case fromAddressing.SET_NETMASK:
    case fromAddressing.SET_GATEWAY: {
        if (getMode(state) === 'station') {
            return { ...state, station: station(state.station, action) };
        } else if (getMode(state) === 'ibss') {
            return { ...state, ibss: ibss(state.ibss, action) };
        }

        return state;
    }
    default:
        return state;
    }
};

export default wifi;

/* eslint-enable no-use-before-define */

// action creators
export const setMode = (mode, lampId) => ({ type: SET_MODE, payload: { mode, lampId } });
export const setSsid = (ssid, lampId) => ({ type: SET_SSID, payload: { ssid, lampId } });

// selectors

// mode
export const getMode = state => state.mode;

// station, ibss
export const getSsid = (state) => {
    if (getMode(state) === 'station') {
        return fromStation.getSsid(state.station);
    } else if (getMode(state) === 'ibss') {
        return fromIbss.getSsid(state.ibss);
    }

    return undefined;
};
export const getPassword = state => fromStation.getPassword(state.station);
export const isDhcpEnabled = state => fromStation.isDhcpEnabled(state.station);
export const getIp = state => fromStation.getIp(state.station);
export const getNetmask = state => fromStation.getNetmask(state.station);
export const getGateway = state => fromStation.getGateway(state.station);
