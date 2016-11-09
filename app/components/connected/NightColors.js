import { connect } from 'react-redux';
import NightColors from 'app/components/presentational/NightColors';
import { getNightColor } from 'app/reducers';
import { setColor } from 'app/reducers/night';

const mapStateToProps = (state, { lampId }) => ({
    color: getNightColor(state, lampId),
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
    setColor: color => dispatch(setColor(color, lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NightColors);
