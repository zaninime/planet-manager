import { connect } from 'react-redux';
import DaySlider from 'app/components/presentational/DaySlider';
import { getDayColor, getDayColorIntensity } from 'app/redux/modules';
import { setColor, setIntensity } from 'app/redux/modules/daylight';

const mapStateToProps = (state, { lampId }) => ({
    color: getDayColor(state, lampId),
    intensity: getDayColorIntensity(state, lampId),
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
    setColor: color => dispatch(setColor(color, lampId)),
    setIntensity: intensity => dispatch(setIntensity(intensity, lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DaySlider);
