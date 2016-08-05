import { LOAD_COMPLETED } from './lampConfig';

const timings = (state = {dawnBeginsAt: 8*60,  duskEndsAt: 18*60}, action) => {
  switch (action.type) {
  case LOAD_COMPLETED:
    return action.data.timings;
  case 'CONFIG_SET_TIMER_START':
    return {...state, start: action.time};
  case 'CONFIG_SET_TIMER_END':
    return {...state, end: action.time};
  default:
    return state;
  }
};

export default timings;
