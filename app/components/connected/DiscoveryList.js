import { connect } from 'react-redux';
import DiscoveryList from 'app/components/presentational/DiscoveryList';
import { startLoading } from 'app/reducers/config';
import { getRecentLamps } from 'app/reducers';

const mapStateToProps = (state, { now }) => ({
    lamps: getRecentLamps(state, now),
});

const mapDispatchToProps = dispatch => ({
    load: lampId => dispatch(startLoading(lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscoveryList);
