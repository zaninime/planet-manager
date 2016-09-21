import { connect } from 'react-redux';
import CustomSlider from 'components/CustomSlider/CustomSlider';
import { getFanStartTemperature } from 'reducers';
import { setStartTemperature } from 'reducers/temperature';

const mapStateToProps = (state, { lampId }) => ({
  value: getFanStartTemperature(state, lampId)
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
  onChange: (e, value) => dispatch(setStartTemperature(value, lampId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomSlider);
