import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DialogTitle from './DialogTitle';

const DecisionDialog = ({
  title,
  message,
  titleColor,
  icon,
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
            title={<DialogTitle title={title} icon={icon} color={titleColor} />}
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
    titleColor: React.PropTypes.string,
    icon: React.PropTypes.string,
    onRequestClose: React.PropTypes.func,
    onTouchTapYes: React.PropTypes.func,
    onTouchTapNo: React.PropTypes.func,
};

export default DecisionDialog;
