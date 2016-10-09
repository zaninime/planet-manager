import { connect } from 'react-redux';
import DiscoveryList from 'components/presentational/DiscoveryList';
import { loadConfig } from 'reducers/lampConfig';
import { getRecentLamps } from 'reducers';

const mapStateToProps = (state, { now }) => ({
  lamps: getRecentLamps(state, now)
});

export default connect(mapStateToProps, { load: loadConfig })(DiscoveryList);
