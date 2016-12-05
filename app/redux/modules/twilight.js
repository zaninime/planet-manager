import { LOAD_COMPLETED } from './config';

// actions
export const SET_RED_LEVEL = 'config/twilight/SET_RED_LEVEL';

const twilight = (state = { redLevel: 0 }, action) => {
    switch (action.type) {
    case LOAD_COMPLETED:
        return action.payload.config.twilight;
    case SET_RED_LEVEL:
        return { ...state, redLevel: action.payload.redLevel };
    default:
        return state;
    }
};

export default twilight;

// action creators
export const setValue = (redLevel, lampId) => ({ type: SET_RED_LEVEL, payload: { redLevel, lampId } });

// selectors
export const getTwilightValue = state => state.redLevel;
