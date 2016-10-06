import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import NavigationMenu from 'components/presentational/NavigationMenu';
import { isConfigSaved, getFieldError, isWifiConfigSaved } from 'reducers';
import { saveConfig } from 'reducers/lampConfig';
import { setFieldError } from 'reducers/fieldError';
import { setConfigSaved } from 'reducers/configSaved';

const mapStateToProps = (state, { lampId }) => ({
  state,
  configSaved: isConfigSaved(state, lampId),
  wifiConfigSaved: isWifiConfigSaved(state, lampId),
  fieldError: getFieldError(state, lampId)
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
  dispatch,
  redirect: (path) => dispatch(push(path)),
  setFieldError: (error) => dispatch(setFieldError(error, lampId)),
  setConfigSaved: () => dispatch(setConfigSaved(lampId))
});

// TODO: temporary solution, not really the proper way.
// MUST fix.
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { lampConfig } = stateProps.state;
  const { dispatch } = dispatchProps;
  const { lampId } = ownProps;

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    saveConfig: () => saveConfig(lampId, lampConfig[lampId])(dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(NavigationMenu);
