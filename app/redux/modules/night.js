import { LOAD_COMPLETED } from './config';

// actions
export const SET_COLOR = 'config/night/SET_COLOR';
export const SET_INTENSITY = 'config/night/SET_INTENSITY';

const night = (state = { color: 'blue', intensity: 0 }, action) => {
    switch (action.type) {
    case LOAD_COMPLETED:
        return action.payload.data.night;
    case SET_COLOR:
        return { ...state, color: action.payload.color };
    case SET_INTENSITY:
        return { ...state, intensity: action.payload.intensity };
    default:
        return state;
    }
};

export default night;

// action creators
export const setColor = (color, lampId) => ({ type: SET_COLOR, payload: { color, lampId } });
export const setIntensity = (intensity, lampId) => ({ type: SET_INTENSITY, payload: { intensity, lampId } });

// selectors
export const getNightColor = state => state.color;
export const getNightColorIntensity = state => state.intensity;
