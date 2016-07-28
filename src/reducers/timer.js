const timer = (state = {}, action) => {
  switch (action.type) {
    case 'CONFIG_SET_TIMER_START':
      return {...state, start: action.time};
    case 'CONFIG_SET_TIMER_END':
      return {...state, end: action.time};
    default:
      return state;
  }
};

export default timer;
