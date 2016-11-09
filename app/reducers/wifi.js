import managed, * as fromManaged from './managed';
import ibss, * as fromIbss from './ibss';
import * as fromAddressing from './addressing';
import { LOAD_COMPLETED } from './config';

// actions
export const SET_MODE = 'lampConfig/wifi/SET_MODE';
export const SET_SSID = 'lampConfig/wifi/SET_SSID';

/* eslint-disable no-use-before-define */

const wifi = (state = { mode: 'ibss', ibss: { }, managed: { } }, action) => {
    switch (action.type) {
    case LOAD_COMPLETED:
        return action.wifi;
    case SET_MODE:
        return { ...state, mode: action.mode };
    case SET_SSID:
    case fromManaged.SET_PASSWORD:
    case fromManaged.TOGGLE_DHCP:
    case fromAddressing.SET_IP:
    case fromAddressing.SET_NETMASK:
    case fromAddressing.SET_GATEWAY: {
        if (getMode(state) === 'managed') {
            return { ...state, managed: managed(state.managed, action) };
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
export const setMode = (mode, lampId) => ({ type: SET_MODE, mode, lampId });
export const setSsid = (ssid, lampId) => ({ type: SET_SSID, ssid, lampId });

// selectors

// mode
export const getMode = state => state.mode;

// managed, ibss
export const getSsid = (state) => {
    if (getMode(state) === 'managed') {
        return fromManaged.getSsid(state.managed);
    } else if (getMode(state) === 'ibss') {
        return fromIbss.getSsid(state.ibss);
    }

    return undefined;
};
export const getPassword = state => fromManaged.getPassword(state.managed);
export const isDhcpEnabled = state => fromManaged.isDhcpEnabled(state.managed);
export const getIp = state => fromManaged.getIp(state.managed);
export const getNetmask = state => fromManaged.getNetmask(state.managed);
export const getGateway = state => fromManaged.getGateway(state.managed);
