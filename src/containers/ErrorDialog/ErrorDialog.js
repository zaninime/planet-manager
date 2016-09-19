import { connect } from 'react-redux';
import ErrorDialog from 'views/ErrorDialog/ErrorDialog';
import { isErrorEncountered, getMessage } from 'reducers/index';
import { toggleError } from 'reducers/connectError';

const mapStateToProps = (state) => ({
  errorEncountered: isErrorEncountered(state),
  message: getMessage(state)
});

export default connect(mapStateToProps, { toggleError })(ErrorDialog);
