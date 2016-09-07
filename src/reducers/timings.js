import { LOAD_COMPLETED } from './lampConfig';

// actions
export const SET_TIMER_START = 'lampConfig/timings/SET_TIMER_START';
export const SET_TIMER_END = 'lampConfig/timings/SET_TIMER_END';

const timings = (state = {dawnBeginsAt: 8 * 60,  duskEndsAt: 18 * 60}, action) => {
  switch (action.type) {
  case LOAD_COMPLETED:
    return action.data.timings;
  case SET_TIMER_START:
    return {...state, dawnBeginsAt: action.dawnBeginsAt};
  case SET_TIMER_END:
    return {...state, duskEndsAt: action.duskEndsAt};
  default:
    return state;
  }
};

export default timings;

// action creators
export const setSunriseTime = (dawnBeginsAt, lampId) => ({ type: SET_TIMER_START, dawnBeginsAt, lampId });
export const setSunsetTime = (duskEndsAt, lampId) => ({ type: SET_TIMER_END, duskEndsAt, lampId });

// selectors
export const getSunriseTime = (state) => state.dawnBeginsAt;
export const getSunsetTime = (state) => state.duskEndsAt;
