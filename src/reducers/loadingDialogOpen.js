import * as fromLampConfig from './lampConfig';
import * as fromConfigSaved from './configSaved';
import * as fromConnectError from './error';

const loadingDialogOpen = (state = false, action) => {
  switch (action.type) {
  case fromLampConfig.LOAD_START:
  case fromConfigSaved.SAVE_START:
    return true;
  case fromLampConfig.LOAD_COMPLETED:
  case fromConfigSaved.SAVE_COMPLETED:
  case fromConnectError.SET_MESSAGE: // prevents the overlapping of dialogs
    return false;
  default:
    return state;
  }
};

export default loadingDialogOpen;

// selectors
export const isLoadingDialogOpen = (state) => state;
