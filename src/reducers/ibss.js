import { SET_SSID } from './wifi';

const ibss = (state = { ssid: '' }, action) => {
  switch (action.type) {
  case SET_SSID:
    return { ...state, ssid: action.ssid };
  default:
    return state;
  }
};

export default ibss;

// selectors
export const getSsid = (state) => state.ssid;
