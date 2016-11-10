import { connect } from 'react-redux';
import ChannelColor from 'app/components/presentational/ChannelColor';
import { getStripCurrentColor, getStripIsEnabled } from 'app/redux/modules';
import { enableStrip, disableStrip, nextStripColor } from 'app/redux/modules/channels';

const mapStateToProps = (state, { lampId, stripNumber }) => ({
    color: getStripCurrentColor(state, stripNumber, lampId),
    enabled: getStripIsEnabled(state, stripNumber, lampId),
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
    enableStrip: idx => dispatch(enableStrip(idx, lampId)),
    disableStrip: idx => dispatch(disableStrip(idx, lampId)),
    nextStripColor: idx => dispatch(nextStripColor(idx, lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelColor);
