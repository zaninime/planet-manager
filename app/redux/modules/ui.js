import { combineReducers } from 'redux';
import fieldError, * as fromFieldError from 'app/redux/modules/fieldError';
import loadingDialogOpen, * as fromLoadingDialogOpen from './loadingDialogOpen';

const ui = combineReducers({
    loadingDialogOpen,
    fieldError,
});

export default ui;

// fieldError
export const getFieldError = state => fromFieldError.getFieldError(state.fieldError);

// loadingDialogOpen
export const isLoadingDialogOpen = state => fromLoadingDialogOpen.isLoadingDialogOpen(state.loadingDialogOpen);
