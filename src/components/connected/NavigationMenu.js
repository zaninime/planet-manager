import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import NavigationMenu from 'components/presentational/NavigationMenu';
import { isConfigSaved, getFieldError, isWifiConfigSaved } from 'reducers';
import { saveConfig } from 'reducers/config';
import { setFieldError } from 'reducers/fieldError';
import { setConfigSaved } from 'reducers/saved';

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
  const { lamps } = stateProps.state;
  const { dispatch } = dispatchProps;
  const { lampId } = ownProps;

  // console.log(lamps);

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    saveConfig: () => saveConfig(lampId, lamps[lampId])(dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(NavigationMenu);
