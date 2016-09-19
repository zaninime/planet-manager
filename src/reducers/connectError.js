// actions
const SET_MESSAGE = 'connectError/SET_MESSAGE';
const TOGGLE_ERROR = 'connectError/TOGGLE_ERROR';

const master = (state = { error: false, message: "" }, action) => {
  switch (action.type) {
  case TOGGLE_ERROR:
    return { ...state, error: !state.error };
  case SET_MESSAGE:
    return { error: true, message: action.message };
  default:
    return state;
  }
};

export default master;

// action creators
export const toggleError = (lampId) => ({ type: TOGGLE_ERROR, lampId });
export const setMessage = (message, lampId) => ({ type: SET_MESSAGE, message, lampId });

// selectors
export const isErrorEncountered = (state) => state.error;
export const getMessage = (state) => state.message;
