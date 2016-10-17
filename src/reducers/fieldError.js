// actions
export const SET_ERROR = 'config/fieldError/SET_ERROR';

const fieldError = (state = false, action) => {
  switch (action.type) {
  case SET_ERROR:
    return action.error;
  default:
    return state;
  }
};

export default fieldError;

// action creators
export const setFieldError = (error, lampId) => ({ type: SET_ERROR, error, lampId });

// selectors
export const getFieldError = (state) => state;
