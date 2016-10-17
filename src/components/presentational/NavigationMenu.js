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
import Snackbar from 'material-ui/Snackbar';
import Section from 'components/views/Section';
import DecisionDialog from 'components/views/DecisionDialog';
import MessageDialog from 'components/views/MessageDialog';
import LoadingDialog from 'components/connected/LoadingDialog';
import SaveErrorDialog from 'components/connected/ErrorDialog';
import { grey400 } from 'material-ui/styles/colors';
import shallowCompare from 'react-addons-shallow-compare';

const styles = {
  centered: {
    margin: 'auto',
    textAlign: 'center'
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
    this.handleFieldErrorCloseRequest = this.handleFieldErrorCloseRequest.bind(this);
    this.handleWifiChangedCloseRequest = this.handleWifiChangedCloseRequest.bind(this);
    this.handleSnackbarCloseRequest = this.handleSnackbarCloseRequest.bind(this);

    const { lampId, redirect } = this.props;
    const paths = ['day', 'twilight', 'night', 'advanced'].map(e => (`/${lampId}/${e}/`));
    this.onTouchTaps = paths.map((e, i) => () => {
      if (this.props.fieldError)
        this.setFieldErrorDialogOpen(true);
      else {
        this.setState({ selectedIndex: i });
        redirect(e);
      }
    });

    this.state = {
      selectedIndex: 0,
      unsavedChangesDialogOpen: false,
      fieldErrorDialogOpen: false,
      wifiChangedDialogOpen: false,
      snackbarOpen: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  handleHomeClick() {
    const { configSaved, fieldError, setFieldError } = this.props;

    // inserting invalid fields doesn't change the store,
    // therefore the saved status could remain the same
    // so fieldError needs to be set to false
    if (configSaved && !fieldError) {
      setFieldError(false);
      this.redirectToHome();
    }
    else
      this.setUnsavedDialogOpen(true);
  }

  handleSaveClick() {
    const {
      configSaved,
      wifiConfigSaved,
      fieldError
    } = this.props;

    if (fieldError)
      this.setFieldErrorDialogOpen(true);
    else if (!configSaved) {
      if (!wifiConfigSaved)
        this.setWifiChangedDialogOpen(true);
      else
        this.saveConfiguration();
    }
    else if (configSaved)
      this.setSnackbarOpen(true);
  }

  saveConfiguration() {
    this.props.saveConfig();
  }

  redirectToHome() {
    this.props.redirect('/');
  }

  setFieldErrorDialogOpen(open) {
    this.setState({ fieldErrorDialogOpen: open });
  }

  setUnsavedDialogOpen(open) {
    this.setState({ unsavedChangesDialogOpen: open });
  }

  setWifiChangedDialogOpen(open) {
    this.setState({ wifiChangedDialogOpen: open });
  }

  setSnackbarOpen(open) {
    this.setState({ snackbarOpen: open });
  }

  handleFieldErrorCloseRequest() {
    this.setFieldErrorDialogOpen(false);
  }

  handleWifiChangedCloseRequest() {
    this.setWifiChangedDialogOpen(false);
    this.saveConfiguration();
  }

  handleTouchTapYes() {
    this.setFieldErrorDialogOpen(false);
    this.redirectToHome();
    // undo changes
    this.props.setFieldError(false);
    this.props.setConfigSaved();
  }

  handleUnsavedChangesCloseRequest() {
    this.setUnsavedDialogOpen(false);
  }

  handleSnackbarCloseRequest() {
    this.setSnackbarOpen(false);
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
          onRequestClose={this.handleFieldErrorCloseRequest}
          onTouchTapOk={this.handleFieldErrorCloseRequest}/>

        <MessageDialog
          title="WARNING!"
          message="Your Wi-Fi configuration has changed and you will be redirected to the home page. Please reboot this lamp."
          dialogOpen={this.state.wifiChangedDialogOpen}
          onTouchTapOk={this.handleWifiChangedCloseRequest} />

        <LoadingDialog />
        <SaveErrorDialog />

        <Snackbar
          bodyStyle={styles.centered}
          open={this.state.snackbarOpen}
          message="This configuration has already been saved"
          autoHideDuration={2000}
          onRequestClose={this.handleSnackbarCloseRequest} />
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
  saveConfig: React.PropTypes.func.isRequired,
  setFieldError: React.PropTypes.func.isRequired,
  setConfigSaved: React.PropTypes.func.isRequired
};

export default Radium(NavigationMenu);
