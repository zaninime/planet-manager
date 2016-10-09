import React, { Component } from 'react';
import Radium from 'radium';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import ip from 'ip';
import shallowCompare from 'react-addons-shallow-compare';

const styles = {
  content: {
    marginTop: '40px'
  },
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
  constructor(props) {
    super(props);
    this.handleOnToggle = this.handleOnToggle.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleGatewayFieldBlur = this.handleGatewayFieldBlur.bind(this);
    this.handleFieldBlur = this.handleFieldBlur.bind(this);

    this.state = this.initState(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillReceiveProps(nextProps) {
    if (shallowCompare(this, nextProps, this.state))
      this.setState(this.initState(nextProps));
  }

  initState({ dhcpEnabled, ip, netmask, gateway }) {
    return {
      toggled: dhcpEnabled,
      addressValue: ip,
      addressErrorText: '',
      netmaskValue: netmask,
      netmaskErrorText: '',
      gatewayValue: gateway,
      gatewayErrorText: '',
      fieldError: false
    };
  }

  handleOnToggle() {
    const { toggled } = this.state;

    if (toggled)
      this.props.onFieldErrorChange(false);

    this.setState({ toggled: !toggled });
    this.props.toggleDhcp();
  }

  handleFieldChange(e, field) {
    const { value } = e.target;

    const newState = { };
    newState[`${field}Value`] = value;
    this.setState(newState);
  }

  handleFieldBlur(field) {
    const newState = { };
    newState[`${field}ErrorText`] = '';

    const value = this.state[`${field}Value`];

    let valid = false;
    if (value !== '') {
      valid = this.validate(field, this.state[`${field}Value`]);

      if (!valid)
        newState[`${field}ErrorText`] = 'Not valid';
    }
    else
      newState[`${field}ErrorText`] = 'Empty fields are not allowed';

    this.setState(newState);

    // if the address or netmask field change
    // and they're both valid, revalidate the gateway
    this.handleGatewayFieldBlur(null, { ...this.state, ...newState });
  }

  handleGatewayFieldBlur(e, state = this.state) {
    const {
      addressValue,
      netmaskValue,
      gatewayValue,
      addressErrorText,
      netmaskErrorText
    } = state;

    let errorText = '';
    if (gatewayValue === '')
      errorText = 'Empty fields are not allowed';
    else if (addressErrorText === '' &&
            netmaskErrorText === '' &&
            !this.validateGateway(gatewayValue, netmaskValue, addressValue))
      errorText = 'Not valid';

    let fieldError = state.fieldError;
    if (!fieldError && (errorText !== '' || addressErrorText !== '' || netmaskErrorText !== ''))
      fieldError = true;
    else if (fieldError && errorText === '' && addressErrorText === '' && netmaskErrorText === '')
      fieldError = false;

    this.props.onFieldErrorChange(fieldError);
    this.setState({ gatewayErrorText: errorText, fieldError });

    if (errorText === '' && netmaskErrorText === '' && addressErrorText === '')
      this.setFields(state);
  }

  setFields({ addressValue, netmaskValue, gatewayValue }) {
    const { setIp, setNetmask, setGateway } = this.props;

    setIp(addressValue);
    setNetmask(netmaskValue);
    setGateway(gatewayValue);
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

  validate(field, value) {
    if (field === 'address')
      return this.validateAddress(value);
    else if (field === 'netmask')
      return this.validateNetmask(value);
  }

  render() {
    let fieldsContainer = null;

    if (this.state.toggled) {
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
            onBlur={this.handleGatewayFieldBlur}/>
        </div>
      );
    }

    return (
      <div style={styles.content}>
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

DhcpSettings.propTypes = {
  dhcpEnabled: React.PropTypes.bool.isRequired,
  ip: React.PropTypes.string.isRequired,
  netmask: React.PropTypes.string.isRequired,
  gateway: React.PropTypes.string.isRequired,
  toggleDhcp: React.PropTypes.func.isRequired,
  setIp: React.PropTypes.func.isRequired,
  setNetmask: React.PropTypes.func.isRequired,
  setGateway: React.PropTypes.func.isRequired,
  onFieldErrorChange: React.PropTypes.func.isRequired
};

export default Radium(DhcpSettings);
