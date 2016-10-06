import { connect } from 'react-redux';
import ErrorDialog from 'components/views/ErrorDialog';
import { isThrown, getMessage } from 'reducers';
import { toggleError } from 'reducers/error';

const mapStateToProps = (state) => ({
  isThrown: isThrown(state),
  message: getMessage(state)
});

export default connect(mapStateToProps, { toggleError })(ErrorDialog);
