import { connect } from 'react-redux';
import { isThrown, isLoadingDialogOpen } from 'app/redux/modules';
import { startLoading } from 'app/redux/modules/config';
import ManualConnectionDialog from 'app/components/presentational/ManualConnectionDialog';

const mapStateToProps = state => ({
    isThrown: isThrown(state),
    isLoadingDialogOpen: isLoadingDialogOpen(state),
});

const mapDispatchToProps = dispatch => ({
    load: lampId => dispatch(startLoading(lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManualConnectionDialog);
