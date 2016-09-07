import { connect } from 'react-redux';
import Timings from 'views/Timings/Timings';
import { getSunriseTime, getSunsetTime } from 'reducers/index';
import { setSunriseTime, setSunsetTime } from 'reducers/timings';

const mapStateToProps = (state, { lampId }) => ({
  sunriseTime: getSunriseTime(state, lampId),
  sunsetTime: getSunsetTime(state, lampId)
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
  setSunriseTime: (time) => dispatch(setSunriseTime(time, lampId)),
  setSunsetTime: (time) => dispatch(setSunsetTime(time, lampId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Timings);
