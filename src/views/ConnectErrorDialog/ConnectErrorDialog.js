import React, { Component } from 'react';
import Radium from 'radium';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const styles = {
  unselectableDialog: {
    userSelect: 'none'
  }
};

class ConnectErrorDialog extends Component {
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
    this.props.toggleError();
  }

  handleTouchTap() {
    this.props.toggleError();
  }

  render() {
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        onTouchTap={this.handleTouchTap}
        />
    ];

    return (
      <Dialog
        title="ERROR!"
        actions={actions}
        open={this.state.open}
        onRequestClose={this.handleRequestClose}
        style={styles.unselectableDialog}>
        {this.props.message}
      </Dialog>
    );
  }
}

ConnectErrorDialog.propTypes = {
  isThrown: React.PropTypes.bool.isRequired,
  message: React.PropTypes.string.isRequired,
  toggleError: React.PropTypes.func.isRequired
};

export default Radium(ConnectErrorDialog);
