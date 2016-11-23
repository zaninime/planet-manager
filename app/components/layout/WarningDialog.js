import React from 'react';
import Radium from 'radium';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { orange500 } from 'material-ui/styles/colors';
import DialogTitle from './DialogTitle';

const styles = {
    unselectableDialog: {
        userSelect: 'none',
    },
};

const WarningDialog = ({
  message,
  dialogOpen,
  onRequestClose,
  onTouchTapOk,
}) => {
    const actions = [
        <FlatButton
            label="Ok"
            primary
            onTouchTap={onTouchTapOk}
        />,
    ];

    return (
        <Dialog
            title={<DialogTitle title="Warning" icon="warning" color={orange500} />}
            actions={actions}
            open={dialogOpen}
            onRequestClose={onRequestClose}
            style={styles.unselectableDialog}
        >
            {message}
        </Dialog>
    );
};

WarningDialog.propTypes = {
    message: React.PropTypes.string.isRequired,
    dialogOpen: React.PropTypes.bool.isRequired,
    onRequestClose: React.PropTypes.func,
    onTouchTapOk: React.PropTypes.func,
};

export default Radium(WarningDialog);
