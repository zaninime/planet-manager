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
import Section from 'views/Section/Section';
import DecisionDialog from 'views/DecisionDialog/DecisionDialog';
import MessageDialog from 'views/MessageDialog/MessageDialog';
import { grey400 } from 'material-ui/styles/colors';
import shallowCompare from 'react-addons-shallow-compare';

const styles = {
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
    this.handleHomeClick = this.handleHomeClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleTouchTapYes = this.handleTouchTapYes.bind(this);
    this.handleUnsavedChangesCloseRequest = this.handleUnsavedChangesCloseRequest.bind(this);
    this.handleFieldErrorRequestClose = this.handleFieldErrorRequestClose.bind(this);
    this.handleWifiChangedRequestClose = this.handleWifiChangedRequestClose.bind(this);

    const { lampId, redirect } = this.props;
    const paths = ['day', 'twilight', 'night', 'advanced'].map(e => (`/${lampId}/${e}/`));
    this.onTouchTaps = paths.map((e, i) => () => {
      if (this.props.fieldError)
        this.setState({ fieldErrorDialogOpen: true });
      else {
        this.setState({ selectedIndex: i });
        redirect(e);
      }
    });

    this.state = {
      selectedIndex: 0,
      unsavedChangesDialogOpen: false,
      fieldErrorDialogOpen: false,
      wifiChangedDialogOpen: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  handleHomeClick() {
    const { configSaved, fieldError, setFieldError, redirect } = this.props;

    // inserting invalid fields doesn't change the store,
    // therefore the saved status could remain the same
    // so fieldError needs to be set to false
    if (configSaved && !fieldError) {
      setFieldError(false);
      redirect('/');
    }
    else
      this.setState({ unsavedChangesDialogOpen: true });
  }

  handleSaveClick() {
    const {
      configSaved,
      wifiConfigSaved,
      fieldError,
      setConfigSaved
    } = this.props;

    if (fieldError)
      this.setState({ fieldErrorDialogOpen: true });
    else if (!configSaved) {
      if (!wifiConfigSaved)
        this.setState({ wifiChangedDialogOpen: true });
      else
        setConfigSaved();
    }
  }

  saveConfiguration() {
    const { setConfigSaved, redirect } = this.props;

    setConfigSaved();
    redirect('/');
  }

  handleFieldErrorRequestClose() {
    this.setState({ fieldErrorDialogOpen: false });
  }

  handleWifiChangedRequestClose() {
    this.setState({ wifiChangedDialogOpen: false });
    this.saveConfiguration();
  }

  handleTouchTapYes() {
    this.handleUnsavedChangesCloseRequest();
    this.saveConfiguration();
    this.props.setFieldError(false);
  }

  handleUnsavedChangesCloseRequest() {
    this.setState({ unsavedChangesDialogOpen: false });
  }

  render() {
    return (
      <div>
        <Section>
          <FloatingActionButton
            style={styles.saveButton}
            mini={true}
            onClick={this.handleSaveClick}>
            <CheckIcon />
          </FloatingActionButton>
          <FloatingActionButton
            style={styles.backButton}
            mini={true}
            backgroundColor={grey400}
            onClick={this.handleHomeClick}>
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

        <DecisionDialog
          title="WARNING!"
          message="Unsaved configurations will be lost, continue without saving?"
          dialogOpen={this.state.unsavedChangesDialogOpen}
          onRequestClose={this.handleUnsavedChangesCloseRequest}
          onTouchTapNo={this.handleUnsavedChangesCloseRequest}
          onTouchTapYes={this.handleTouchTapYes} />

        <MessageDialog
          title="ERROR!"
          message="Please, you need to fix the field error(s) to continue."
          dialogOpen={this.state.fieldErrorDialogOpen}
          onRequestClose={this.handleFieldErrorRequestClose}
          onTouchTapOk={this.handleFieldErrorRequestClose}/>

        <MessageDialog
          title="WARNING!"
          message="Your Wi-Fi configuration has changed and you will be redirected to the home page. Please reboot this lamp."
          dialogOpen={this.state.wifiChangedDialogOpen}
          onTouchTapOk={this.handleWifiChangedRequestClose} />
      </div>
    );
  }
}

NavigationMenu.propTypes = {
  configSaved: React.PropTypes.bool.isRequired,
  wifiConfigSaved: React.PropTypes.bool.isRequired,
  fieldError: React.PropTypes.bool.isRequired,
  lampId: React.PropTypes.string.isRequired,
  redirect: React.PropTypes.func.isRequired,
  setConfigSaved: React.PropTypes.func.isRequired,
  setFieldError: React.PropTypes.func.isRequired
};

export default Radium(NavigationMenu);
