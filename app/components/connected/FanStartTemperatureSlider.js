import { connect } from 'react-redux';
import CustomSlider from 'app/components/presentational/CustomSlider';
import { getFanStartTemperature } from 'app/redux/modules';
import { setStartTemperature } from 'app/redux/modules/temperature';

const mapStateToProps = (state, { lampId }) => ({
    value: getFanStartTemperature(state, lampId),
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
    onChange: (e, value) => dispatch(setStartTemperature(value, lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomSlider);
