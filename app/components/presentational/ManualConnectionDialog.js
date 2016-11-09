import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { encode, AddressFormatError, PortFormatError } from 'app/utils/lampId';
import shallowCompare from 'react-addons-shallow-compare';

const styles = {
    unselectableDialog: {
        userSelect: 'none',
    },
    dialogContent: {
        textAlign: 'center',
        marginTop: '3em',
        marginBottom: '3em',
        overflowY: 'auto',
        height: '100%',
    },
    flex: {
        display: 'flex',
    },
    labelContainer: {
        width: '30%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    textFieldContainer: {
        width: '70%',
    },
    textField: {
        width: '80%',
    },
};

class ManualConnectionDialog extends Component {
    static getEmptyInputsState() {
        return {
            portValue: '',
            portErrorText: '',
            hostValue: '',
            hostErrorText: '',
        };
    }

    constructor(props) {
        super(props);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleConnectTouchTap = this.handleConnectTouchTap.bind(this);
        this.handleHostChange = this.handleHostChange.bind(this);
        this.handlePortChange = this.handlePortChange.bind(this);

        this.state = {
            ...ManualConnectionDialog.getEmptyInputsState(),
            open: this.props.dialogOpen,
            buttonsDisabled: false,
        };

        this.wasOpen = this.props.dialogOpen;
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.isThrown || nextProps.isLoadingDialogOpen) && nextProps.dialogOpen) {
            this.wasOpen = true;
            this.setState({ open: false });
        } else if (!nextProps.isThrown && this.wasOpen) {
            this.wasOpen = false;
            this.setState({
        // the dialog is opened or
        // an error was previously thrown and it was open
                open: true,
                buttonsDisabled: false,
            });
        } else if (nextProps.dialogOpen) {
            this.setState({ open: true, buttonsDisabled: false });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    handleRequestClose() {
        this.setState({
            ...ManualConnectionDialog.getEmptyInputsState(),
            open: false,
        });

        this.props.onRequestClose();
    }

    handleConnectTouchTap() {
        let { hostErrorText, portErrorText } = this.state;

        if (this.state.hostValue === '') {
            hostErrorText = 'Empty fields are not allowed';
        }

        if (this.state.portValue === '') {
            portErrorText = 'Empty fields are not allowed';
        }

        if (hostErrorText === '' && portErrorText === '') {
            this.setState({ buttonsDisabled: true });
        }

        const { hostValue, portValue } = this.state;

        if (hostErrorText === '' || portErrorText === '') {
            try {
                const encoded = encode(hostValue, parseInt(portValue, 10));
                this.props.load(encoded);
            } catch (ex) {
                this.setState({ buttonsDisabled: false });

                if (ex instanceof AddressFormatError && hostErrorText === '') {
                    hostErrorText = 'Not valid';
                } else if (ex instanceof PortFormatError && portErrorText === '') {
                    portErrorText = 'Not valid';
                }
            }
        }

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
            if (isNaN(value)) {
                errorText = 'Must be a number';
            } else if (value < 1 || value > 65535) {
                errorText = 'Not valid';
            }
        }

        this.setState({ portValue: value, portErrorText: errorText });
    }

    render() {
        const manualActions = [
            <FlatButton
                label="Cancel"
                primary
                disabled={this.state.buttonsDisabled}
                onTouchTap={this.handleRequestClose}
            />,
            <FlatButton
                label="Connect"
                primary
                disabled={this.state.buttonsDisabled}
                onTouchTap={this.handleConnectTouchTap}
            />,
        ];

        return (
            <Dialog
                title="Connect manually"
                actions={manualActions}
                open={this.state.open}
                onRequestClose={this.handleRequestClose}
                style={styles.unselectableDialog}
            >
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
                                onChange={this.handleHostChange}
                            />
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
                                onChange={this.handlePortChange}
                            >
                                <input type="number" min="1" max="65535" value={this.state.portValue} />
                            </TextField>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}

/* eslint-disable */
ManualConnectionDialog.propTypes = {
    dialogOpen: React.PropTypes.bool.isRequired,
    isThrown: React.PropTypes.bool.isRequired,
    onRequestClose: React.PropTypes.func.isRequired,
    load: React.PropTypes.func.isRequired,
};

export default ManualConnectionDialog;
