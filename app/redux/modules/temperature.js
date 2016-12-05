import { LOAD_COMPLETED } from './config';

// actions
export const SET_START_TEMPERATURE = 'config/temperature/SET_START_TEMPERATURE';

// TODO: state initial value
const temperature = (state = { fanStart: 15 }, action) => {
    switch (action.type) {
    case LOAD_COMPLETED:
        return action.payload.config.temperature;
    case SET_START_TEMPERATURE:
        return { ...state, fanStart: action.payload.fanStart };
    default:
        return state;
    }
};

export default temperature;

// action creators
export const setStartTemperature = (fanStart, lampId) => ({
    type: SET_START_TEMPERATURE,
    payload: { fanStart, lampId },
});

// selectors
export const getFanStartTemperature = state => state.fanStart;
