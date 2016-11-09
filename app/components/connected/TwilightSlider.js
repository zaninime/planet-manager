import { connect } from 'react-redux';
import TwilightSlider from 'app/components/presentational/TwilightSlider';
import { getTwilightValue } from 'app/reducers';
import { setValue } from 'app/reducers/twilight';

const mapStateToProps = (state, { lampId }) => ({
    twilightValue: getTwilightValue(state, lampId),
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
    setValue: value => dispatch(setValue(value, lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TwilightSlider);
