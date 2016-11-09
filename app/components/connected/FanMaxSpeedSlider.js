import { connect } from 'react-redux';
import CustomSlider from 'app/components/presentational/CustomSlider';
import { getFanMaxSpeed } from 'app/reducers';
import { setMaxSpeed } from 'app/reducers/fan';

const mapStateToProps = (state, { lampId }) => ({
    value: getFanMaxSpeed(state, lampId),
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
    onChange: (e, value) => dispatch(setMaxSpeed(value, lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomSlider);
