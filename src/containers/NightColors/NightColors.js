import { connect } from 'react-redux';
import NightColors from 'components/NightColors/NightColors';
import { getNightColor } from 'reducers';
import { setColor } from 'reducers/night';

const mapStateToProps = (state, { lampId }) => ({
  color: getNightColor(state, lampId)
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
  setColor: (color) => dispatch(setColor(color, lampId))
});

export default connect(mapStateToProps, mapDispatchToProps)(NightColors);
