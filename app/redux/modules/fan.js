import { LOAD_COMPLETED } from './config';

// actions
export const SET_MAX_SPEED = 'config/fan/SET_MAX_SPEED';

// TODO: state initial value
const fan = (state = { maxSpeed: 50 }, action) => {
    switch (action.type) {
    case LOAD_COMPLETED:
        return action.payload.config.fan;
    case SET_MAX_SPEED:
        return { ...state, maxSpeed: action.payload.maxSpeed };
    default:
        return state;
    }
};

export default fan;

// action creators
export const setMaxSpeed = (maxSpeed, lampId) => ({ type: SET_MAX_SPEED, payload: { maxSpeed, lampId } });

// selectors
export const getFanMaxSpeed = state => state.maxSpeed;
