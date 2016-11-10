import { LOAD_COMPLETED } from './config';

const master = (state = false, action) => {
    switch (action.type) {
    case LOAD_COMPLETED:
        return action.payload.data.master;
    default:
        return state;
    }
};

export default master;
