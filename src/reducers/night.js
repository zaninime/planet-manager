import { LOAD_COMPLETED } from './lampConfig';

// actions
export const SET_COLOR = "lampConfig/night/SET_COLOR";
export const SET_INTENSITY = "lampConfig/night/SET_INTENSITY";

const night = (state = {color: 'blue', intensity: 0}, action) => {
  switch (action.type) {
  case LOAD_COMPLETED:
    return action.data.night;
  case SET_COLOR:
    return {...state, color: action.color};
  case SET_INTENSITY:
    return {...state, intensity: action.intensity};
  default:
    return state;
  }
};

export default night;

// action creators
export const setColor = (color, lampId) => ({ type: SET_COLOR, color, lampId });
export const setIntensity = (intensity, lampId) => ({ type: SET_INTENSITY, intensity, lampId });

// selectors
export const getNightColor = (state) => state.color;
export const getNightColorIntensity = (state) => state.intensity;
