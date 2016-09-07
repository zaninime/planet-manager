import React, { Component } from 'react';
import Radium from 'radium';
import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

const styles = {
  radioButtons: {
    textAlign: 'left',
    marginBottom: '40px'
  },
  fieldsContainer: {
    marginBottom: '60px'
  },
  textField: {
    maxWidth: '512px',
    width: '100%'
  }
};

class ClientSettings extends Component {
  constructor(props) {
    super(props);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handlePortChange = this.handlePortChange.bind(this);

    this.state = {
      selectedMode: 'client',
      ssidValue: '',
      ssidErrorText: '',
      pwdValue: '',
      pwdErrorText: '',
      portValue: '',
      portErrorText: ''
    };
  }

  handleModeChange(e, value) {
    this.setState({ selectedMode: value });
  }

  handleFieldChange(e, field) {
    const value = e.target.value;

    let newState = { };
    newState[`${field}Value`] = value;

    newState[`${field}ErrorText`] = '';
    if (value.length > 32)
      newState[`${field}ErrorText`] = 'Must contain 32 characters at most';

    this.setState(newState);
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
    let passwordPortContainer = null;

    if (this.state.selectedMode === 'client') {
      passwordPortContainer = (
        <div>
          <p>Password</p>
          <TextField
            style={styles.textField}
            name="pwd"
            errorText={this.state.pwdErrorText}
            onChange={e => this.handleFieldChange(e, 'pwd')}>
            <input
              type="password"
              value={this.state.pwdValue}/>
          </TextField>

          <p>Port</p>
          <TextField
            style={styles.textField}
            name="port"
            errorText={this.state.portErrorText}
            onChange={this.handlePortChange}>
            <input
              type="number"
              min="1"
              max="65535"
              value={this.state.portValue}/>
          </TextField>
        </div>
      );
    }

    return (
      <div>
        <div style={styles.radioButtons}>
          <RadioButtonGroup
            name="Mode"
            valueSelected={this.state.selectedMode}
            onChange={this.handleModeChange}>
            <RadioButton
              value="access_point"
              label="Access Point"/>
            <RadioButton
              value="client"
              label="Client"/>
          </RadioButtonGroup>
        </div>

        <div style={styles.fieldsContainer}>
          <p>Network Name</p>
          <TextField
            style={styles.textField}
            name="ssid"
            value={this.state.ssidValue}
            errorText={this.state.ssidErrorText}
            onChange={e => this.handleFieldChange(e, 'ssid')}
            onBlur={this.handleSsidBlur} />

          {passwordPortContainer}
        </div>
      </div>
    );
  }
}

export default Radium(ClientSettings);
