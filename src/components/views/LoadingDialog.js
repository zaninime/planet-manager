import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';
import shallowCompare from 'react-addons-shallow-compare';

const styles = {
  progressbarContainer: {
    margin: '1em',
    textAlign: 'center'
  },
  unselectableDialog: {
    userSelect: 'none'
  }
};

class LoadingDialog extends Component {
  constructor(props) {
    super(props);

    this.state = { open: this.props.dialogOpen };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isThrown) {
      this.setState({ open: false });
      this.props.onRequestClose();
    }
    else
      this.setState({ open: nextProps.dialogOpen });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <Dialog
        title="Talking with your lamp..."
        open={this.state.open}
        style={styles.unselectableDialog}>
        <div style={styles.progressbarContainer}>
          <LinearProgress mode="indeterminate" />
        </div>
      </Dialog>
    );
  }
}

LoadingDialog.propTypes = {
  dialogOpen: React.PropTypes.bool.isRequired,
  isThrown: React.PropTypes.bool.isRequired,
  onRequestClose: React.PropTypes.func.isRequired
};

export default LoadingDialog;
