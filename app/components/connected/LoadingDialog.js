import { connect } from 'react-redux';
import LoadingDialog from 'app/components/layout/LoadingDialog';
import { isLoadingDialogOpen } from 'app/redux/modules';

const mapStateToProps = state => ({
    isLoadingDialogOpen: isLoadingDialogOpen(state),
});

export default connect(mapStateToProps)(LoadingDialog);
