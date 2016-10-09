import { connect } from 'react-redux';
import LoadingDialog from 'components/views/LoadingDialog';
import { isThrown } from 'reducers';

const mapStateToProps = (state) => ({
  isThrown: isThrown(state)
});

export default connect(mapStateToProps)(LoadingDialog);
