import { LOAD_COMPLETED } from './lampConfig';

const temperature = (state = {}, action) => {
  switch (action.type) {
  case LOAD_COMPLETED:
    return action.data.temperature;
  default:
    return state;
  }
};

export default temperature;