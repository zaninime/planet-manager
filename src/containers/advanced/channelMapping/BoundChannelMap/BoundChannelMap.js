import { connect } from 'react-redux';
import ChannelMap from 'components/advanced/channelMapping/ChannelMap/ChannelMap';

const mapStateToProps = ({ lampConfig }) => ({
  channels: lampConfig.channelMapping.length
});

export default connect(mapStateToProps)(ChannelMap);
