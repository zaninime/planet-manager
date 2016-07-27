import { connect } from 'react-redux';
import ChannelColor from 'components/advanced/ChannelColor/ChannelColor';

const getCurrentColor = (state, stripNumber) => {
  const COLORS = {
    1: 'white',
    2: 'red',
    3: 'green',
    4: 'blue',
    5: 'off'
  };
  return COLORS[state[stripNumber]];
}

const mapStateToProps = (state, ownProps) => ({
  color: getCurrentColor(state.lampConfig.channelMapping, ownProps.number)
});

const mapDispatchToProps = (dispatch) => ({
  onClick: dispatch(/* toggleColor */)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelColor);
