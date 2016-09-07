import { connect } from 'react-redux';
import { loadConfig } from 'reducers/lampConfig';
import ManualConnectionDialog from 'components/ManualConnectionDialog/ManualConnectionDialog';

export default connect(null, { load: loadConfig })(ManualConnectionDialog);
