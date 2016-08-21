import React, { Component } from 'react';
import Radium from 'radium';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import ip from 'ip';

const styles = {
  toggle: {
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

class DhcpSettings extends Component {
  constructor(props){
    super(props);
    this.handleOnToggle = this.handleOnToggle.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFieldBlur = this.handleFieldBlur.bind(this);

    this.state = {
      toggled: true,
      addressValue: '',
      addressErrorText: '',
      netmaskValue: '',
      netmaskErrorText: '',
      gatewayValue: '',
      gatewayErrorText: ''
    };
  }

  handleOnToggle(){
    this.setState({ toggled: !this.state.toggled });
  }

  handleFieldChange(e, field){
    let newState = { };
    newState[`${field}Value`] = e.target.value;
    this.setState(newState);
  }

  handleFieldBlur(field){
    const addressValue = this.state.addressValue;
    const netmaskValue = this.state.netmaskValue;
    const gatewayValue = this.state.gatewayValue;

    let valid = true;
    if (this.state[`${field}Value`] !== ''){
      if (field === 'address')
        valid = this.validateAddress(addressValue);
      else if (field === 'netmask')
        valid = this.validateNetmask(netmaskValue);
      else if (field === 'gateway' && addressValue != '' && netmaskValue != '')
        valid = this.validateGateway(gatewayValue, netmaskValue, addressValue);

      // if the address or netmask field changes
      // then re-validate the gateway
      if (field !== 'gateway' && gatewayValue != '')
        this.handleFieldBlur('gateway');
    }

    const newState = { };
    newState[`${field}ErrorText`] = '';

    if (!valid)
      newState[`${field}ErrorText`] = 'Not valid';

    this.setState(newState);
  }

  validateNetmask(value) {
    value = value.trim();
    const regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = value.match(regex);

    let valid = true;
    if (match !== null) {
      const netmaskBytes = [0, 128, 192, 224, 240, 248, 252, 254, 255];
      let last = 0;

      for (let i = 4; i > 0; i--) {
        for (let j = netmaskBytes.length - 1; j >= last; j--) {
          if (netmaskBytes[j] === parseInt(match[i])) {
            last = j;
            break;
          }

          if (j === last) {
            valid = false;
          }
        }
      }
    }

    return valid && match !== null;
  }

  validateAddress(value) {
    return ip.isV4Format(value) || ip.isV6Format(value);
  }

  validateGateway(gatewayValue, netmaskValue, addressValue) {
    if (!(this.validateNetmask(netmaskValue) && this.validateAddress(addressValue)))
      return false;

    gatewayValue = gatewayValue.trim();

    const regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = gatewayValue.match(regex);

    // subnet information
    const result = ip.subnet(addressValue, netmaskValue);

    return match != null && result.contains(gatewayValue);
  }

  render(){
    let fieldsContainer = null;

    if (!this.state.toggled){
      fieldsContainer = (
        <div style={styles.fieldsContainer}>
          <p>Address</p>
          <TextField
            style={styles.textField}
            name="address"
            value={this.state.addressValue}
            errorText={this.state.addressErrorText}
            onChange={e => this.handleFieldChange(e, 'address')}
            onBlur={() => this.handleFieldBlur('address')}/>

          <p>Netmask</p>
          <TextField
            style={styles.textField}
            name="netmask"
            value={this.state.netmaskValue}
            errorText={this.state.netmaskErrorText}
            onChange={e => this.handleFieldChange(e, 'netmask')}
            onBlur={() => this.handleFieldBlur('netmask')}/>

          <p>Gateway</p>
          <TextField
            style={styles.textField}
            name="gateway"
            value={this.state.gatewayValue}
            errorText={this.state.gatewayErrorText}
            onChange={e => this.handleFieldChange(e, 'gateway')}
            onBlur={() => this.handleFieldBlur('gateway')}/>
        </div>
      );
    }

    return (
      <div>
        <Toggle
          style={styles.toggle}
          label="DHCP"
          toggled={this.state.toggled}
          onToggle={this.handleOnToggle} />

        {fieldsContainer}
      </div>
    );
  }
}

export default Radium(DhcpSettings);
