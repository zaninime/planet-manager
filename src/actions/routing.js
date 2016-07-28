import { push } from 'react-router-redux';

export const navigateTo = (path) => (dispatch) => dispatch(push(path));
