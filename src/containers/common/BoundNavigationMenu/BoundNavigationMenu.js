import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import NavigationMenu from 'components/common/NavigationMenu/NavigationMenu';

const mapDispatchToProps = (dispatch) => {
  return {
    redirect: (path) => {
      dispatch(push(path));
    }
  };
};

export default connect(null, mapDispatchToProps)(NavigationMenu);
