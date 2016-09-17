import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import NavigationMenu from 'components/NavigationMenu/NavigationMenu';
import { isConfigSaved, getFieldError, isWifiConfigSaved } from 'reducers';
import { setConfiSaved } from 'reducers/configSaved';
import { setFieldError } from 'reducers/fieldError';

const mapStateToProps = (state, { lampId }) => ({
  configSaved: isConfigSaved(state, lampId),
  wifiConfigSaved: isWifiConfigSaved(state, lampId),
  fieldError: getFieldError(state, lampId)
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
  redirect: (path) => dispatch(push(path)),
  setConfigSaved: () => dispatch(setConfiSaved(lampId)),
  setFieldError: (error) => dispatch(setFieldError(error, lampId))
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigationMenu);
