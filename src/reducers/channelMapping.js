const colors = ['white', 'red', 'green', 'blue'];

const channel = (state = {color: 'white', enabled: true}, action) => {
  switch (action.type) {
  case 'CONFIG_NEXT_STRIP_COLOR':
    return {...state, color: colors[(colors.indexOf(state.color)+1)%colors.length]};
  case 'CONFIG_TOGGLE_STRIP_ENABLE':
    return {...state, enabled: true};
  case 'CONFIG_TOGGLE_STRIP_DISABLE':
    return {...state, enabled: false};
  default:
    return state;
  }
};

const channelMapping = (state = [{color: 'white', enabled: true}, {color: 'white', enabled: true}], action) => {
  switch (action.type) {
  case 'CONFIG_LOAD':
      // TODO
    return [{color: 'green', enabled: false}];
  case 'CONFIG_NEXT_STRIP_COLOR':
  case 'CONFIG_TOGGLE_STRIP_ENABLE':
  case 'CONFIG_TOGGLE_STRIP_DISABLE':
    return [...state.slice(0, (action.idx-1)), channel(state[action.idx-1], action), ...state.slice(action.idx)];
  default:
    return state;
  }
};

export default channelMapping;

// selectors
export const getStripCurrentColor = (state, stripNumber) => (state[stripNumber-1].color);
export const getStripIsEnabled = (state, stripNumber) => (state[stripNumber-1].enabled);
