import React from 'react';
import Radium from 'radium';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const styles = {
  unselectableDialog: {
    userSelect: 'none'
  }
};

const MessageDialog = ({
  title,
  message,
  dialogOpen,
  onRequestClose,
  onTouchTapOk
}) => {
  const actions = [
    <FlatButton
      label="Ok"
      primary={true}
      onTouchTap={onTouchTapOk}
      />
  ];

  return (
    <Dialog
      title={title}
      actions={actions}
      open={dialogOpen}
      onRequestClose={onRequestClose}
      style={styles.unselectableDialog}>
      {message}
    </Dialog>
  );
};

MessageDialog.propTypes = {
  title: React.PropTypes.string.isRequired,
  message: React.PropTypes.string.isRequired,
  dialogOpen: React.PropTypes.bool.isRequired,
  onRequestClose: React.PropTypes.func,
  onTouchTapOk: React.PropTypes.func
};

export default Radium(MessageDialog);
