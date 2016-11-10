import { connect } from 'react-redux';
import WifiSettings from 'app/components/presentational/WifiSettings';
import { getMode, getSsid, getPassword } from 'app/redux/modules';
import { setMode, setSsid } from 'app/redux/modules/wifi';
import { setPassword } from 'app/redux/modules/station';
import { setFieldError } from 'app/redux/modules/fieldError';

const mapStateToProps = (state, { lampId }) => ({
    mode: getMode(state, lampId),
    ssid: getSsid(state, lampId),
    password: getPassword(state, lampId),
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
    setMode: mode => dispatch(setMode(mode, lampId)),
    setSsid: ssid => dispatch(setSsid(ssid, lampId)),
    setPassword: pwd => dispatch(setPassword(pwd, lampId)),
    setFieldError: error => dispatch(setFieldError(error, lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WifiSettings);
