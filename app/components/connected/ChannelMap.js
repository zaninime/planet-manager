import { connect } from 'react-redux';
import ChannelMap from 'app/components/presentational/ChannelMap';
import { getChannelsCount, isChannelMappingAvailable } from 'app/reducers';

const mapStateToProps = (state, { lampId }) => ({
    channelMappingAvailable: isChannelMappingAvailable(state, lampId),
    channels: getChannelsCount(state, lampId),
});

export default connect(mapStateToProps)(ChannelMap);
