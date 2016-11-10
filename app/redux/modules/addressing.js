// actions
export const SET_IP = 'config/wifi/station/addressing/SET_IP';
export const SET_NETMASK = 'config/wifi/station/addressing/SET_NETMASK';
export const SET_GATEWAY = 'config/wifi/station/addressing/SET_GATEWAY';

const addressing = (state = { ip: '', netmask: '', gateway: '' }, action) => {
    switch (action.type) {
    case SET_IP:
        return { ...state, ip: action.payload.ip };
    case SET_NETMASK:
        return { ...state, netmask: action.payload.netmask };
    case SET_GATEWAY:
        return { ...state, gateway: action.payload.gateway };
    default:
        return state;
    }
};

export default addressing;

// action creators
export const setIp = (ip, lampId) => ({ type: SET_IP, payload: { ip, lampId } });
export const setNetmask = (netmask, lampId) => ({ type: SET_NETMASK, payload: { netmask, lampId } });
export const setGateway = (gateway, lampId) => ({ type: SET_GATEWAY, payload: { gateway, lampId } });

// selectors
export const getIp = state => state.ip;
export const getNetmask = state => state.netmask;
export const getGateway = state => state.gateway;
