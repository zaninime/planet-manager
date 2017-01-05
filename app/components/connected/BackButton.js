import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import BackButton from 'app/components/presentational/BackButton';

const mapDispatchToProps = (dispatch) => ({
    replace: path => dispatch(push(path)),
});

export default connect(
    null,
    mapDispatchToProps,
)(BackButton);
