import { connect } from 'react-redux';
import { isThrown, isLoadingDialogOpen } from 'app/reducers';
import { startLoading } from 'app/reducers/config';
import ManualConnectionDialog from 'app/components/presentational/ManualConnectionDialog';

const mapStateToProps = state => ({
    isThrown: isThrown(state),
    isLoadingDialogOpen: isLoadingDialogOpen(state),
});

const mapDispatchToProps = dispatch => ({
    load: lampId => dispatch(startLoading(lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManualConnectionDialog);
