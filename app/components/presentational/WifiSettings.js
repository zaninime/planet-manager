import React, { Component } from 'react';
import Radium, { Style } from 'radium';
import TextField from 'material-ui/TextField';
import DhcpSettings from 'app/components/connected/DhcpSettings';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import shallowCompare from 'react-addons-shallow-compare';

const styles = {
    content: {
        width: '80%',
        margin: 'auto',
    },
    radioButtons: {
        textAlign: 'left',
        marginBottom: '40px',
    },
    fieldsContainer: {
        marginBottom: '40px',
    },
    textField: {
        maxWidth: '512px',
        width: '100%',
    },
    p: {
        marginBottom: '0px',
    },
};

class WifiSettings extends Component {
    static initState({ mode, ssid, password }) {
        return {
            selectedMode: mode,
            ssidValue: ssid,
            ssidErrorText: '',
            pwdValue: password,
            pwdErrorText: '',
            fieldError: false,
            dhcpSettingsFieldError: false,
        };
    }

    constructor(props) {
        super(props);
        this.handleModeChange = this.handleModeChange.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleFieldBlur = this.handleFieldBlur.bind(this);
        this.handleFieldErrorChange = this.handleFieldErrorChange.bind(this);

        this.state = WifiSettings.initState(props);
    }

    componentWillReceiveProps(nextProps) {
        if (shallowCompare(this, nextProps, this.state)) {
            this.setState(WifiSettings.initState(nextProps));
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    handleModeChange(e, value) {
        this.props.setFieldError(false);
        this.props.setMode(value);
    }

    handleFieldChange(e, field) {
        const value = e.target.value;

        const newState = { };
        newState[`${field}Value`] = value;

        newState[`${field}ErrorText`] = '';
        if (value.length > 32) {
            newState[`${field}ErrorText`] = 'Must contain 32 characters at most';
        } else if (value.length === 0) {
            newState[`${field}ErrorText`] = 'Empty fields are not allowed';
        }

        const { ssidErrorText, pwdErrorText } = { ...this.state, ...newState };
        let fieldError = false;
        if (ssidErrorText !== '' || pwdErrorText !== '') {
            fieldError = true;
        }

        this.setState({ ...newState, fieldError });
        this.props.setFieldError(this.state.dhcpSettingsFieldError || fieldError);
    }

    handleFieldErrorChange(value) {
        this.setState({ dhcpSettingsFieldError: value });
        this.props.setFieldError(value || this.state.fieldError);
    }

    handleFieldBlur() {
        const { ssidErrorText, pwdErrorText, ssidValue, pwdValue } = this.state;
        const { setSsid, setPassword } = this.props;

        if (ssidErrorText === '') {
            setSsid(ssidValue);
        }

        if (pwdErrorText === '') {
            setPassword(pwdValue);
        }
    }

    render() {
        let passwordDhcpContainer = null;

        if (this.state.selectedMode === 'station') {
            passwordDhcpContainer = (
                <div>
                    <p>Password</p>
                    <TextField
                        style={styles.textField}
                        name="pwd"
                        errorText={this.state.pwdErrorText}
                        onChange={e => this.handleFieldChange(e, 'pwd')}
                        onBlur={this.handleFieldBlur}
                    >
                        <input
                            type="password"
                            value={this.state.pwdValue}
                        />
                    </TextField>

                    <DhcpSettings
                        lampId={this.props.lampId}
                        onFieldErrorChange={this.handleFieldErrorChange}
                    />
                </div>
            );
        }

        return (
            <div style={styles.content}>
                <Style rules={{ p: styles.p }} />
                <div style={styles.radioButtons}>
                    <RadioButtonGroup
                        name="Mode"
                        valueSelected={this.state.selectedMode}
                        onChange={this.handleModeChange}
                    >
                        <RadioButton
                            value="ibss"
                            label="Access Point"
                        />
                        <RadioButton
                            value="station"
                            label="Client"
                        />
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
                        onBlur={this.handleFieldBlur}
                    />

                    {passwordDhcpContainer}
                </div>
            </div>
        );
    }
}

/* eslint-disable */
WifiSettings.propTypes = {
    mode: React.PropTypes.string.isRequired,
    ssid: React.PropTypes.string.isRequired,
    password: React.PropTypes.string.isRequired,
    lampId: React.PropTypes.string.isRequired,
    setMode: React.PropTypes.func.isRequired,
    setSsid: React.PropTypes.func.isRequired,
    setPassword: React.PropTypes.func.isRequired,
    setFieldError: React.PropTypes.func.isRequired,
};

export default Radium(WifiSettings);
