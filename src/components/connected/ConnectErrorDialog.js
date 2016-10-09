import { connect } from 'react-redux';
import ConnectErrorDialog from 'components/views/ConnectErrorDialog';
import { isThrown, getMessage } from 'reducers';
import { toggleError } from 'reducers/connectError';

const mapStateToProps = (state) => ({
  isThrown: isThrown(state),
  message: getMessage(state)
});

export default connect(mapStateToProps, { toggleError })(ConnectErrorDialog);
