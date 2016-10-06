import { connect } from 'react-redux';
import CustomSlider from 'components/presentational/CustomSlider';
import { getNightColorIntensity } from 'reducers';
import { setIntensity } from 'reducers/night';

const mapStateToProps = (state, { lampId }) => ({
  value: getNightColorIntensity(state, lampId)
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
  onChange: (e, value) => dispatch(setIntensity(value, lampId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomSlider);