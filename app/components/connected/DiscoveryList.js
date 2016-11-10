import { connect } from 'react-redux';
import DiscoveryList from 'app/components/presentational/DiscoveryList';
import { startLoading } from 'app/redux/modules/config';
import { getRecentLamps } from 'app/redux/modules';

const mapStateToProps = (state, { now }) => ({
    lamps: getRecentLamps(state, now),
});

const mapDispatchToProps = dispatch => ({
    load: lampId => dispatch(startLoading(lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DiscoveryList);
