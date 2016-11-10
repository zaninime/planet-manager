import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import NavigationMenu from 'app/components/presentational/NavigationMenu';
import { isConfigSaved, getFieldError, isWifiConfigSaved } from 'app/redux/modules';
import { setFieldError } from 'app/redux/modules/fieldError';
import { setConfigSaved, startSaving } from 'app/redux/modules/saved';

const mapStateToProps = (state, { lampId }) => ({
    state,
    configSaved: isConfigSaved(state, lampId),
    wifiConfigSaved: isWifiConfigSaved(state, lampId),
    fieldError: getFieldError(state, lampId),
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
    redirect: path => dispatch(push(path)),
    setFieldError: error => dispatch(setFieldError(error, lampId)),
    setConfigSaved: () => dispatch(setConfigSaved(lampId)),
    saveConfig: () => dispatch(startSaving(lampId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationMenu);
