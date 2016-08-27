import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const styles = {
  dialogContent:{
    textAlign: 'center',
    marginTop: '3em',
    marginBottom: '3em',
    overflowY: 'auto',
    height: '100%'
  },
  flex:{
    display: 'flex'
  },
  labelContainer:{
    width: '30%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textFieldContainer:{
    width: '70%'
  },
  textField:{
    width: '80%'
  }
};

class ManualConnectionDialog extends Component {
  constructor(props) {
    super(props);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleConnectTouchTap = this.handleConnectTouchTap.bind(this);
    this.handleHostChange = this.handleHostChange.bind(this);
    this.handlePortChange = this.handlePortChange.bind(this);

    this.state = this.getEmptyInputsState();
  }

  getEmptyInputsState() {
    return {
      portValue: '',
      portErrorText: '',
      hostValue: '',
      hostErrorText: ''
    };
  }

  handleRequestClose() {
    this.props.onRequestClose();
    this.setState(this.getEmptyInputsState);
  }

  handleConnectTouchTap() {
    let hostErrorText = this.state.hostErrorText;
    let portErrorText = this.state.portErrorText;

    if (this.state.hostValue === '')
      hostErrorText = 'Cannot be empty';

    if (this.state.portValue === '')
      portErrorText = 'Cannot be empty';

    this.setState({ hostErrorText, portErrorText });
  }

  handleHostChange(e) {
    // set value
    this.setState({ hostValue: e.target.value, hostErrorText: '' });
  }

  handlePortChange(e) {
    const value = e.target.value;
    let errorText = '';

    if (value !== '') {
      if (isNaN(value))
        errorText = 'Must be a number';
      else if (value < 1 || value > 65535)
        errorText = 'Not valid';
    }

    this.setState({ portValue: value, portErrorText: errorText });
  }

  render() {
    const manualActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleRequestClose}
        />,
      <FlatButton
        label="Connect"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleConnectTouchTap}
        ref="submit"
        />,
    ];

    return (
      <Dialog
        title="Connect manually"
        actions={manualActions}
        open={this.props.dialogOpen}
        onRequestClose={this.handleRequestClose}>
        <div style={styles.dialogContent}>
          <div style={styles.flex}>
            <div style={styles.labelContainer}>
              <p>Host:</p>
            </div>
            <div style={styles.textFieldContainer}>
              <TextField
                style={styles.textField}
                value={this.state.hostValue}
                hintText="80.98.130.124"
                errorText={this.state.hostErrorText}
                onChange={this.handleHostChange}/>
            </div>
          </div>
          <div style={styles.flex}>
            <div style={styles.labelContainer}>
              <p>Port:</p>
            </div>
            <div style={styles.textFieldContainer}>
              <TextField
                style={styles.textField}
                hintText="5000"
                errorText={this.state.portErrorText}
                onChange={this.handlePortChange}>
                <input type="number" min="1" max="65535" value={this.state.portValue}/>
              </TextField>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

ManualConnectionDialog.propTypes = {
  dialogOpen: React.PropTypes.bool.isRequired,
  onRequestClose: React.PropTypes.func.isRequired
};

export default ManualConnectionDialog;
