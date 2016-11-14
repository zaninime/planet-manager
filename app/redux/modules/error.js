import Raven from 'raven-js';

// actions
export const SET_ERROR = 'error/SET_ERROR';
export const CLEAR_ERROR = 'error/CLEAR_ERROR';

const error = (state = { error: false, content: { } }, action) => {
    switch (action.type) {
    case CLEAR_ERROR:
        return { ...state, error: false, content: { } };
    case SET_ERROR:
        return { error: action.error, content: action.payload };
    default:
        return state;
    }
};

export default error;

// action creators
export const clearError = () => ({ type: CLEAR_ERROR });
export const setError = err => {
    if (!__DEBUG__) {
        if (typeof err.getRavenExtra === 'function') {
            Raven.captureException(err, { extra: err.getRavenExtra() });
        } else {
            Raven.captureException(err);
        }
    } else {
        console.warn('Managed exception', err); // eslint-disable-line
    }
    return { type: SET_ERROR, payload: err, error: true };
};

// selectors
export const isThrown = state => state.error;
export const getErrorContent = state => state.content;
