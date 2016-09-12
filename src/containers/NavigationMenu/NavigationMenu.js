import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import NavigationMenu from 'components/NavigationMenu/NavigationMenu';

export default connect(null, { redirect: push })(NavigationMenu);