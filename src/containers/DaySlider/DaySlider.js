import { connect } from 'react-redux';
import DaySlider from 'components/DaySlider/DaySlider';
import { getDayColor, getDayColorIntensity } from 'reducers';
import { setColor, setIntensity } from 'reducers/daylight';

const mapStateToProps = (state, { lampId }) => ({
  color: getDayColor(state, lampId),
  intensity: getDayColorIntensity(state, lampId)
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
  setColor: (color) => dispatch(setColor(color, lampId)),
  setIntensity: (intensity) => dispatch(setIntensity(intensity, lampId))
});

export default connect(mapStateToProps, mapDispatchToProps)(DaySlider);
