import OperationModeSwitch from 'app/components/presentational/OperationModeSwitch';

import { connect } from 'react-redux';
import { getOperationMode } from 'app/redux/modules';
import { switchMode } from 'app/redux/modules/master';

const mapStateToProps = (state, { lampId }) => ({
    mode: getOperationMode(state, lampId),
});

const mapDispatchToProps = (dispatch, { lampId }) => ({
    onSwitch: () => dispatch(switchMode(lampId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OperationModeSwitch);
