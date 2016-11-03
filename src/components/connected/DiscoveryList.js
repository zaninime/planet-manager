import { connect } from 'react-redux';
import DiscoveryList from 'components/presentational/DiscoveryList';
import { startLoading } from 'reducers/config';
import { getRecentLamps } from 'reducers';

const mapStateToProps = (state, { now }) => ({
  lamps: getRecentLamps(state, now)
});

const mapDispatchToProps = (dispatch) => ({
  load: (lampId) => dispatch(startLoading(lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscoveryList);
