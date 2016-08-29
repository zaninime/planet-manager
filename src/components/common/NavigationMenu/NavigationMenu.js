import React, { Component, PropTypes as T } from 'react';
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

    const { lampId, redirect } = this.props;
    const paths = ['day', 'twilight', 'night', 'advanced'].map(e => (`/${lampId}/${e}/`));
    this.onTouchTaps = paths.map((e, i) => () => {
      this.select(i);
      redirect(e);
    });

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
              onTouchTap={this.onTouchTaps[0]} />
            <BottomNavigationItem
              label="Twilight"
              icon={<TwilightIcon style={styles.centered}/>}
              onTouchTap={this.onTouchTaps[1]} />
            <BottomNavigationItem
              label="Night"
              icon={<NightIcon style={styles.centered}/>}
              onTouchTap={this.onTouchTaps[2]} />
            <BottomNavigationItem
              label="Advanced"
              icon={<SettingsIcon style={styles.centered}/>}
              onTouchTap={this.onTouchTaps[3]} />
          </BottomNavigation>
        </Paper>
      </div>
    );
  }
}

NavigationMenu.propTypes = {
  redirect: React.PropTypes.func.isRequired,
  lampId: T.string.isRequired
};

export default Radium(NavigationMenu);
