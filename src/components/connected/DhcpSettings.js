import { connect } from 'react-redux';
import DhcpSettings from 'components/presentational/DhcpSettings';
import { isDhcpEnabled, getIp, getNetmask, getGateway } from 'reducers';
import { toggleDhcp } from 'reducers/managed';
import { setIp, setNetmask, setGateway } from 'reducers/addressing';

const mapStateToProps = (state, { lampId }) => ({
  dhcpEnabled: isDhcpEnabled(state, lampId),
  ip: getIp(state, lampId),
  netmask: getNetmask(state, lampId),
  gateway: getGateway(state, lampId)
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
  toggleDhcp: () => dispatch(toggleDhcp(lampId)),
  setIp: (ip) => dispatch(setIp(ip, lampId)),
  setNetmask: (netmask) => dispatch(setNetmask(netmask, lampId)),
  setGateway: (gateway) => dispatch(setGateway(gateway, lampId))
});

export default connect(mapStateToProps, mapDispatchToProps)(DhcpSettings);
