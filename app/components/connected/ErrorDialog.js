import { connect } from 'react-redux';
import ErrorDialog from 'app/components/layout/ErrorDialog';
import { isThrown, getMessage } from 'app/reducers';
import { toggleError } from 'app/reducers/error';

const mapStateToProps = state => ({
    isThrown: isThrown(state),
    message: getMessage(state),
});

export default connect(mapStateToProps, { toggleError })(ErrorDialog);
