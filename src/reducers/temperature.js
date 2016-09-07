import { LOAD_COMPLETED } from './lampConfig';

// actions
export const SET_START_TEMPERATURE = 'lampConfig/temperature/SET_START_TEMPERATURE';

// TODO: state initial value
const temperature = (state = { fanStart: 15 }, action) => {
  switch (action.type) {
  case LOAD_COMPLETED:
    return action.data.temperature;
  case SET_START_TEMPERATURE:
    return {...state, fanStart: action.fanStart};
  default:
    return state;
  }
};

export default temperature;

// action creators
export const setStartTemperature = (fanStart, lampId) => ({ type: SET_START_TEMPERATURE, fanStart, lampId });

// selectors
export const getFanStartTemperature = (state) => state.fanStart;
