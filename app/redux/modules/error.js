// actions
export const SET_ERROR = 'error/SET_ERROR';
export const CLEAR_ERROR = 'error/CLEAR_ERROR';

const error = (state = { error: false, content: { } }, action) => {
    switch (action.type) {
    case CLEAR_ERROR:
        return { ...state, error: false, content: { } };
    case SET_ERROR:
        /* eslint no-console:0 */
        console.error(action.payload);

        return { error: action.error, content: action.payload };
    default:
        return state;
    }
};

export default error;

// action creators
export const clearError = () => ({ type: CLEAR_ERROR });
export const setError = err => ({ type: SET_ERROR, payload: err, error: true });

// selectors
export const isThrown = state => state.error;
export const getErrorContent = state => state.content;
