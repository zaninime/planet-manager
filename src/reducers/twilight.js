import { LOAD_COMPLETED } from './lampConfig';

const twilight = (state = {redLevel: 0}, action) => {
  switch (action.type) {
  case LOAD_COMPLETED:
    return action.data.twilight;
  default:
    return state;
  }
};

export default twilight;