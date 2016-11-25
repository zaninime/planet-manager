import { LOAD_COMPLETED } from './config';

export const SWITCH_MODE = 'config/master/SWITCH_MODE';

const master = (state = false, action) => {
    switch (action.type) {
    case LOAD_COMPLETED:
        return action.payload.data.master;
    case SWITCH_MODE:
        return !state;
    default:
        return state;
    }
};

export default master;

// action creators
export const switchMode = (lampId) => ({ type: SWITCH_MODE, payload: { lampId } });

// selectors
export const getOperationMode = (state) => {
    if (state) return 'master';
    return 'slave';
};
