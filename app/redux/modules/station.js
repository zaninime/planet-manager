import { SET_SSID } from './wifi';
import addressing, * as fromAddressing from './addressing';

// actions
export const SET_PASSWORD = 'config/wifi/station/SET_PASSWORD';
export const TOGGLE_DHCP = 'config/wifi/station/SET_DHCP';

/* eslint-disable no-use-before-define */

const station = (state = { ssid: '', password: '', dhcp: true, addressing: { } }, action) => {
    switch (action.type) {
    case SET_SSID:
        return { ...state, ssid: action.payload.ssid };
    case SET_PASSWORD:
        return { ...state, password: action.payload.password };
    case TOGGLE_DHCP:
        return { ...state, dhcp: !state.dhcp };
    case fromAddressing.SET_IP:
    case fromAddressing.SET_NETMASK:
    case fromAddressing.SET_GATEWAY: {
        if (isDhcpEnabled(state)) {
            return { ...state, addressing: addressing(state.addressing, action) };
        }
        return state;
    }
    default:
        return state;
    }
};

export default station;

/* eslint-enable no-use-before-define */

// action creators
export const setPassword = (password, lampId) => ({ type: SET_PASSWORD, payload: { password, lampId } });
export const toggleDhcp = lampId => ({ type: TOGGLE_DHCP, payload: { lampId } });

// selectors

// station
export const getSsid = state => state.ssid;
export const getPassword = state => state.password;
export const isDhcpEnabled = state => state.dhcp;

// addressing
export const getIp = state => fromAddressing.getIp(state.addressing);
export const getNetmask = state => fromAddressing.getNetmask(state.addressing);
export const getGateway = state => fromAddressing.getGateway(state.addressing);
