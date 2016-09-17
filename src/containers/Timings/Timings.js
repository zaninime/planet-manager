import { connect } from 'react-redux';
import Timings from 'views/Timings/Timings';
import { getSunriseTime, getSunsetTime } from 'reducers';
import { setSunriseTime, setSunsetTime } from 'reducers/timings';
import { setFieldError } from 'reducers/fieldError';

const mapStateToProps = (state, { lampId }) => ({
  sunriseTime: getSunriseTime(state, lampId),
  sunsetTime: getSunsetTime(state, lampId)
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
  setSunriseTime: (time) => dispatch(setSunriseTime(time, lampId)),
  setSunsetTime: (time) => dispatch(setSunsetTime(time, lampId)),
  setFieldError: (error) => dispatch(setFieldError(error, lampId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Timings);
