import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const DecisionDialog = ({
  title,
  message,
  dialogOpen,
  onRequestClose,
  onTouchTapYes,
  onTouchTapNo,
}) => {
    const actions = [
        <FlatButton
            label="Yes"
            primary
            onTouchTap={onTouchTapYes}
        />,
        <FlatButton
            label="No"
            primary
            onTouchTap={onTouchTapNo}
        />,
    ];

    return (
        <Dialog
            title={title}
            actions={actions}
            open={dialogOpen}
            onRequestClose={onRequestClose}
        >
            {message}
        </Dialog>
    );
};

DecisionDialog.propTypes = {
    dialogOpen: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired,
    onRequestClose: React.PropTypes.func,
    onTouchTapYes: React.PropTypes.func,
    onTouchTapNo: React.PropTypes.func,
};

export default DecisionDialog;
