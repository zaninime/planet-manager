import { connect } from 'react-redux';
import LoadingDialog from 'app/components/layout/LoadingDialog';
import { isLoadingDialogOpen } from 'app/reducers';

const mapStateToProps = state => ({
    isLoadingDialogOpen: isLoadingDialogOpen(state),
});

export default connect(mapStateToProps)(LoadingDialog);
