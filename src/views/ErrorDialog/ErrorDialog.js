import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class ErrorDialog extends Component {
  constructor(props) {
    super(props);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);

    this.state = { open: this.props.errorEncountered };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ open: nextProps.errorEncountered });
  }

  handleRequestClose() {
    this.setState({ open: false });
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
        title="Error!"
        actions={actions}
        open={this.state.open}
        onRequestClose={this.handleRequestClose}>
        {this.props.message}
      </Dialog>
    );
  }
}

ErrorDialog.propTypes = {
  errorEncountered: React.PropTypes.bool.isRequired,
  message: React.PropTypes.string.isRequired,
  toggleError: React.PropTypes.func.isRequired
};

export default ErrorDialog;
