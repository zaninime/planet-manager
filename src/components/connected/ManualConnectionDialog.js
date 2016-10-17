import { connect } from 'react-redux';
import { isThrown, isLoadingDialogOpen } from 'reducers';
import { loadConfig } from 'reducers/config';
import ManualConnectionDialog from 'components/presentational/ManualConnectionDialog';

const mapStateToProps = (state) => ({
  isThrown: isThrown(state),
  isLoadingDialogOpen: isLoadingDialogOpen(state)
});

export default connect(mapStateToProps, {
  load: loadConfig
})(ManualConnectionDialog);
