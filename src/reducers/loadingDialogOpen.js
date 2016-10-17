import * as fromLampConfig from './config';
import * as fromSaved from './saved';
import * as fromConnectError from './error';

const loadingDialogOpen = (state = false, action) => {
  switch (action.type) {
  case fromLampConfig.LOAD_START:
  case fromSaved.SAVE_START:
    return true;
  case fromLampConfig.LOAD_COMPLETED:
  case fromSaved.SAVE_COMPLETED:
  case fromConnectError.SET_MESSAGE: // prevents the overlapping of dialogs
    return false;
  default:
    return state;
  }
};

export default loadingDialogOpen;

// selectors
export const isLoadingDialogOpen = (state) => state;
