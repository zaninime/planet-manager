import { connect } from 'react-redux';
import CustomSlider from 'app/components/presentational/CustomSlider';
import { getFanMaxSpeed } from 'app/redux/modules';
import { setMaxSpeed } from 'app/redux/modules/fan';

const mapStateToProps = (state, { lampId }) => ({
    value: getFanMaxSpeed(state, lampId),
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
    onChange: (e, value) => dispatch(setMaxSpeed(value, lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomSlider);
