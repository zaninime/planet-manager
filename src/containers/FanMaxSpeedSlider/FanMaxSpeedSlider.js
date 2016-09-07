import { connect } from 'react-redux';
import CustomSlider from 'components/CustomSlider/CustomSlider';
import { getFanMaxSpeed } from 'reducers/index';
import { setMaxSpeed } from 'reducers/fan';

const mapStateToProps = (state, { lampId }) => ({
  value: getFanMaxSpeed(state, lampId)
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
  onChange: (e, value) => dispatch(setMaxSpeed(value, lampId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomSlider);
