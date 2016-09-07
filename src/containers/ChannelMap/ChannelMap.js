import { connect } from 'react-redux';
import ChannelMap from 'components/ChannelMap/ChannelMap';
import { getChannelsCount } from 'reducers/index';

const mapStateToProps = (state, { lampId }) => ({
  channels: getChannelsCount(state, lampId)
});

export default connect(mapStateToProps)(ChannelMap);
