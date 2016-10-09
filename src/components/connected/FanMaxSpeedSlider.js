import { connect } from 'react-redux';
import CustomSlider from 'components/presentational/CustomSlider';
import { getFanMaxSpeed } from 'reducers';
import { setMaxSpeed } from 'reducers/fan';

const mapStateToProps = (state, { lampId }) => ({
  value: getFanMaxSpeed(state, lampId)
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
  onChange: (e, value) => dispatch(setMaxSpeed(value, lampId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomSlider);
