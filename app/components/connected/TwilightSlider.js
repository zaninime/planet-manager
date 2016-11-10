import { connect } from 'react-redux';
import TwilightSlider from 'app/components/presentational/TwilightSlider';
import { getTwilightValue } from 'app/redux/modules';
import { setValue } from 'app/redux/modules/twilight';

const mapStateToProps = (state, { lampId }) => ({
    twilightValue: getTwilightValue(state, lampId),
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
    setValue: value => dispatch(setValue(value, lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TwilightSlider);
