// actions
export const SET_IP = 'lampConfig/wifi/managed/addressing/SET_IP';
export const SET_NETMASK = 'lampConfig/wifi/managed/addressing/SET_NETMASK';
export const SET_GATEWAY = 'lampConfig/wifi/managed/addressing/SET_GATEWAY';

const addressing = (state = { ip: '', netmask: '', gateway: '' }, action) => {
  switch (action.type) {
  case SET_IP:
    return {...state, ip: action.ip};
  case SET_NETMASK:
    return {...state, netmask: action.netmask};
  case SET_GATEWAY:
    return {...state, gateway: action.gateway};
  default:
    return state;
  }
};

export default addressing;

// action creators
export const setIp = (ip, lampId) => ({ type: SET_IP, ip, lampId });
export const setNetmask = (netmask, lampId) => ({ type: SET_NETMASK, netmask, lampId });
export const setGateway = (gateway, lampId) => ({ type: SET_GATEWAY, gateway, lampId });

// selectors
export const getIp = (state) => state.ip;
export const getNetmask = (state) => state.netmask;
export const getGateway = (state) => state.gateway;
