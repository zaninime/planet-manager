import React, { Component } from 'react';
import Radium from 'radium';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { red900 } from 'material-ui/styles/colors';
import DialogTitle from '../presentational/DialogTitle';

const styles = {
    unselectableDialog: {
        WebkitUserSelect: 'none',
    },
};

class ErrorDialog extends Component {
    constructor(props) {
        super(props);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.handleTouchTap = this.handleTouchTap.bind(this);

        this.state = { open: this.props.isThrown };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ open: nextProps.isThrown });
    }

    handleRequestClose() {
        this.setState({ open: false });
        this.props.clearError();
    }

    handleTouchTap() {
        this.props.clearError();
    }

    render() {
        const actions = [
            <FlatButton
                label="Ok"
                primary
                onTouchTap={this.handleTouchTap}
            />,
        ];

        const message = this.props.error.message || 'Unknown';

        return (
            <Dialog
                title={<DialogTitle title="Error" icon="error" color={red900} />}
                actions={actions}
                open={this.state.open}
                onRequestClose={this.handleRequestClose}
                style={styles.unselectableDialog}
            >
                {message}
            </Dialog>
        );
    }
}

ErrorDialog.propTypes = {
    isThrown: React.PropTypes.bool.isRequired,
    error: React.PropTypes.object.isRequired,
    clearError: React.PropTypes.func.isRequired,
};

export default Radium(ErrorDialog);
