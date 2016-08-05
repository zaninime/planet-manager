import { connect } from 'react-redux';
import ChannelColor from 'components/advanced/channelMapping/ChannelColor/ChannelColor';
import { getStripCurrentColor, getStripIsEnabled } from 'reducers';
import { enableStrip, disableStrip, nextStripColor } from 'reducers/lampConfig';

const mapStateToProps = (state, {stripNumber}) => ({
  color: getStripCurrentColor(state, stripNumber),
  enabled: getStripIsEnabled(state, stripNumber)
});

export default connect(mapStateToProps, {
  enableStrip, disableStrip, nextStripColor
})(ChannelColor);
