import { connect } from 'react-redux';
import { goBack, replace } from 'react-router-redux';
import NavigationMenu from 'app/components/presentational/NavigationMenu';
import { isConfigSaved, getFieldError, isWifiConfigSaved } from 'app/redux/modules';
import { setFieldError } from 'app/redux/modules/fieldError';
import { setConfigSaved, startSaving } from 'app/redux/modules/saved';

const mapStateToProps = (state, { lampId }) => ({
    configSaved: isConfigSaved(state, lampId),
    wifiConfigSaved: isWifiConfigSaved(state, lampId),
    fieldError: getFieldError(state, lampId),
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
    goBack: path => dispatch(goBack(path)),
    replace: path => dispatch(replace(path)),
    saveConfig: () => dispatch(startSaving(lampId)),
    setConfigSaved: () => dispatch(setConfigSaved(lampId)),
    setFieldError: error => dispatch(setFieldError(error, lampId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigationMenu);
