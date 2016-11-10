import { LOAD_COMPLETED } from './config';

// actions
export const SET_TIMER_START = 'config/timings/SET_TIMER_START';
export const SET_TIMER_END = 'config/timings/SET_TIMER_END';

const timings = (state = { dawnBeginsAt: 8 * 60, duskEndsAt: 18 * 60 }, action) => {
    switch (action.type) {
    case LOAD_COMPLETED:
        return action.payload.data.timings;
    case SET_TIMER_START:
        return { ...state, dawnBeginsAt: action.payload.dawnBeginsAt };
    case SET_TIMER_END:
        return { ...state, duskEndsAt: action.payload.duskEndsAt };
    default:
        return state;
    }
};

export default timings;

// action creators
export const setSunriseTime = (dawnBeginsAt, lampId) => ({ type: SET_TIMER_START, payload: { dawnBeginsAt, lampId } });
export const setSunsetTime = (duskEndsAt, lampId) => ({ type: SET_TIMER_END, payload: { duskEndsAt, lampId } });

// selectors
export const getSunriseTime = state => state.dawnBeginsAt;
export const getSunsetTime = state => state.duskEndsAt;
