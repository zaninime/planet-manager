import { LOAD_COMPLETED } from './lampConfig';

const fan = (state = {}, action) => {
  switch (action.type) {
  case LOAD_COMPLETED:
    return action.data.fan;
  default:
    return state;
  }
};

export default fan;