import * as fromConfig from './config';

const info = (state = {}, action) => {
    switch (action.type) {
    case fromConfig.LOAD_COMPLETED:
        return action.payload.info;
    default:
        return state;
    }
};

export default info;
