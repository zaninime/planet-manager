import { combineReducers } from 'redux';
import loadingDialogOpen, * as fromLoadingDialogOpen from './loadingDialogOpen';
import fieldError, * as fromFieldError from 'reducers/fieldError';

const ui = combineReducers({
  loadingDialogOpen,
  fieldError
});

export default ui;

// fieldError
export const getFieldError = (state) => fromFieldError.getFieldError(state.fieldError);

// loadingDialogOpen
export const isLoadingDialogOpen = (state) => fromLoadingDialogOpen.isLoadingDialogOpen(state.loadingDialogOpen);
