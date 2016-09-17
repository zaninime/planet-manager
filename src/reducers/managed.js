import { SET_SSID } from './wifi';
import addressing, * as fromAddressing from './addressing';

// actions
export const SET_PASSWORD = 'lampConfig/wifi/managed/SET_PASSWORD';
export const TOGGLE_DHCP = 'lampConfig/wifi/managed/SET_DHCP';

const managed = (state = {
  ssid: '', password: '', dhcp: true, addressing: {  }
}, action) => {
  switch (action.type) {
  case SET_SSID:
    return { ...state, ssid: action.ssid };
  case SET_PASSWORD:
    return { ...state, password: action.password };
  case TOGGLE_DHCP:
    return { ...state, dhcp: !state.dhcp };
  case fromAddressing.SET_IP:
  case fromAddressing.SET_NETMASK:
  case fromAddressing.SET_GATEWAY: {
    if (isDhcpEnabled(state))
      return { ...state, addressing: addressing(state.addressing, action) };
    return state;
  }
  default:
    return state;
  }
};

export default managed;

// action creators
export const setPassword = (password, lampId) => ({ type: SET_PASSWORD, password, lampId });
export const toggleDhcp = (lampId) => ({ type: TOGGLE_DHCP, lampId });

// selectors

// managed
export const getSsid = (state) => state.ssid;
export const getPassword = (state) => state.password;
export const isDhcpEnabled = (state) => state.dhcp;

// addressing
export const getIp = (state) => fromAddressing.getIp(state.addressing);
export const getNetmask = (state) => fromAddressing.getNetmask(state.addressing);
export const getGateway = (state) => fromAddressing.getGateway(state.addressing);
