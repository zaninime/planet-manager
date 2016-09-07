import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import ScheduleIcon from 'material-ui/svg-icons/action/schedule';

class SyncClockButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);

    this.state = { open: false };
  }

  handleTouchTap() {
    this.setState({ open: true });
  }

  handleRequestClose() {
    this.setState({ open: false });
  }

  render() {
    return (
      <div style={this.props.style}>
        <RaisedButton
          onTouchTap={this.handleTouchTap}
          label="Synchronize Clock"
          primary={true}
          icon={<ScheduleIcon />}/>
        <Snackbar
          open={this.state.open}
          message="Clock Synchronized"
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose}/>
      </div>
    );
  }
}

SyncClockButton.propTypes = {
  style: React.PropTypes.object
};

export default SyncClockButton;
