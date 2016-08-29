import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import NavigationMenu from 'components/common/NavigationMenu/NavigationMenu';

export default connect(null, {redirect: push})(NavigationMenu);
