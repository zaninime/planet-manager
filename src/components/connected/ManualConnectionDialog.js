import { connect } from 'react-redux';
import { isThrown } from 'reducers';
import { loadConfig } from 'reducers/lampConfig';
import ManualConnectionDialog from 'components/presentational/ManualConnectionDialog';

const mapStateToProps = (state) => ({
  isThrown: isThrown(state)
});

export default connect(mapStateToProps, {
  load: loadConfig
})(ManualConnectionDialog);
