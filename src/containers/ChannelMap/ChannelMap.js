import { connect } from 'react-redux';
import ChannelMap from 'components/ChannelMap/ChannelMap';
import { getChannelsCount, isChannelMappingAvailable } from 'reducers';

const mapStateToProps = (state, { lampId }) => ({
  channelMappingAvailable: isChannelMappingAvailable(state, lampId),
  channels: getChannelsCount(state, lampId)
});

export default connect(mapStateToProps)(ChannelMap);
