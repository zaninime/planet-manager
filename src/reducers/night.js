import { LOAD_COMPLETED } from './lampConfig';

const night = (state = {color: 'blue', intensity: 0}, action) => {
  switch (action.type) {
  case LOAD_COMPLETED:
    return action.data.night;
  default:
    return state;
  }
};

export default night;