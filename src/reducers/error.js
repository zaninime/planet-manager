// actions
export const SET_MESSAGE = 'error/SET_MESSAGE';
export const TOGGLE_ERROR = 'error/TOGGLE_ERROR';

const error = (state = { error: false, message: "" }, action) => {
  switch (action.type) {
  case TOGGLE_ERROR:
    return { ...state, error: !state.error };
  case SET_MESSAGE:
    return { error: true, message: action.message };
  default:
    return state;
  }
};

export default error;

// action creators
export const toggleError = (lampId) => ({ type: TOGGLE_ERROR, lampId });
export const setMessage = (message, lampId) => ({ type: SET_MESSAGE, message, lampId });

// selectors
export const isThrown = (state) => state.error;
export const getMessage = (state) => state.message;
