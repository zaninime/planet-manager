import { connect } from 'react-redux';
import { isThrown, isLoadingDialogOpen } from 'reducers';
import { startLoading } from 'reducers/config';
import ManualConnectionDialog from 'components/presentational/ManualConnectionDialog';

const mapStateToProps = (state) => ({
  isThrown: isThrown(state),
  isLoadingDialogOpen: isLoadingDialogOpen(state)
});

const mapDispatchToProps = (dispatch) => ({
  load: (lampId) => dispatch(startLoading(lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManualConnectionDialog);
