import { connect } from 'react-redux';
import CustomSlider from 'app/components/presentational/CustomSlider';
import { getNightColorIntensity } from 'app/redux/modules';
import { setIntensity } from 'app/redux/modules/night';

const mapStateToProps = (state, { lampId }) => ({
    value: getNightColorIntensity(state, lampId),
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
    onChange: (e, value) => dispatch(setIntensity(value, lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomSlider);
