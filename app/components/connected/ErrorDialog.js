import { connect } from 'react-redux';
import ErrorDialog from 'app/components/layout/ErrorDialog';
import { isThrown, getErrorContent } from 'app/redux/modules';
import { clearError } from 'app/redux/modules/error';

const mapStateToProps = state => ({
    isThrown: isThrown(state),
    error: getErrorContent(state),
});

export default connect(mapStateToProps, { clearError })(ErrorDialog);
