import { connect } from 'react-redux';
import DiscoveryList from 'components/DiscoveryList/DiscoveryList';
import { loadConfig } from 'reducers/lampConfig';
import { getRecentLamps } from 'reducers/index';

const mapStateToProps = (state) => ({
  lamps: getRecentLamps(state)
});

export default connect(mapStateToProps, { load: loadConfig })(DiscoveryList);
