import React, { Component } from 'react';
import Radium from 'radium';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import NightIcon from 'material-ui/svg-icons/image/brightness-3';
import DayIcon from 'material-ui/svg-icons/image/wb-sunny';
import TwilightIcon from 'material-ui/svg-icons/image/brightness-4';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import ChevronCheckIcon from 'material-ui/svg-icons/navigation/chevron-left';
import Section from 'views/main/common/Section/Section';
import { grey400 } from 'material-ui/styles/colors';

const styles = {
  section: {
    position: 'relative'
  },
  centered: {
    margin: 'auto'
  },
  content: {
    position: 'fixed',
    width: '100%',
    bottom: '0'
  },
  backButton: {
    position: 'absolute',
    left: '20px',
    top: '20px'
  },
  saveButton: {
    position: 'absolute',
    right: '20px',
    top: '20px'
  },
  backIcon: {
    back: 'black'
  }
};

class NavigationMenu extends Component {
  constructor(props) {
    super(props);

    this.state = { selectedIndex: 0 };
  }

  select(index) {
    this.setState({ selectedIndex: index });
  }

  render() {
    const { redirect } = this.props;

    return (
      <div>
        <Section style={styles.section}>
          <FloatingActionButton
            style={styles.saveButton}
            mini={true}>
            <CheckIcon />
          </FloatingActionButton>
          <FloatingActionButton
            style={styles.backButton}
            mini={true}
            backgroundColor={grey400}
            onClick={() => redirect('/')}>
            <ChevronCheckIcon />
          </FloatingActionButton>
        </Section>

        <Paper zDepth={1} style={styles.content}>
          <BottomNavigation selectedIndex={this.state.selectedIndex}>
            <BottomNavigationItem
              label="Day"
              icon={<DayIcon style={styles.centered}/>}
              onTouchTap={() => {
                this.select(0);
                redirect('/day');
              }} />
            <BottomNavigationItem
              label="Twilight"
              icon={<TwilightIcon style={styles.centered}/>}
              onTouchTap={() => {
                this.select(1);
                redirect('/twilight');
              }} />
            <BottomNavigationItem
              label="Night"
              icon={<NightIcon style={styles.centered}/>}
              onTouchTap={() => {
                this.select(2);
                redirect('/night');
              }} />
            <BottomNavigationItem
              label="Advanced"
              icon={<SettingsIcon style={styles.centered}/>}
              onTouchTap={() => {
                this.select(3);
                redirect('/advanced');
              }} />
          </BottomNavigation>
        </Paper>
      </div>
    );
  }
}

NavigationMenu.propTypes = {
  redirect: React.PropTypes.func.isRequired
};

export default Radium(NavigationMenu);
