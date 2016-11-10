import { connect } from 'react-redux';
import Timings from 'app/components/layout/Timings';
import { getSunriseTime, getSunsetTime } from 'app/redux/modules';
import { setSunriseTime, setSunsetTime } from 'app/redux/modules/timings';
import { setFieldError } from 'app/redux/modules/fieldError';

const mapStateToProps = (state, { lampId }) => ({
    sunriseTime: getSunriseTime(state, lampId),
    sunsetTime: getSunsetTime(state, lampId),
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
    setSunriseTime: time => dispatch(setSunriseTime(time, lampId)),
    setSunsetTime: time => dispatch(setSunsetTime(time, lampId)),
    setFieldError: error => dispatch(setFieldError(error, lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Timings);
