import { LOAD_COMPLETED } from './config';

// actions
export const SET_COLOR = 'config/daylight/SET_COLOR';
export const SET_INTENSITY = 'config/daylight/SET_INTENSIY';

const daylight = (state = {mainColor: 0, intensity: 0}, action) => {
  switch (action.type) {
  case LOAD_COMPLETED:
    return action.data.daylight;
  case SET_COLOR:
    return {...state, mainColor: action.mainColor};
  case SET_INTENSITY:
    return {...state, intensity: action.intensity};
  default:
    return state;
  }
};

export default daylight;

// action creators
export const setColor = (mainColor, lampId) => ({ type: SET_COLOR, mainColor, lampId });
export const setIntensity = (intensity, lampId) => ({ type: SET_INTENSITY, intensity, lampId });

// selectors
export const getDayColor = (state) => state.mainColor;
export const getDayColorIntensity = (state) => state.intensity;
