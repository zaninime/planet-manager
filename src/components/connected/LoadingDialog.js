import { connect } from 'react-redux';
import LoadingDialog from 'components/views/LoadingDialog';
import { isLoadingDialogOpen } from 'reducers';

const mapStateToProps = (state) => ({
  isLoadingDialogOpen: isLoadingDialogOpen(state)
});

export default connect(mapStateToProps)(LoadingDialog);
