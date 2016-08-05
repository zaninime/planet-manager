import { LOAD_COMPLETED } from './lampConfig';

const daylight = (state = {mainColor: 0, intensity: 0}, action) => {
  switch (action.type) {
  case LOAD_COMPLETED:
    return action.data.daylight;
  default:
    return state;
  }
};

export default daylight;