import React from 'react';
import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';

const styles = {
  progressbarContainer: {
    margin: '1em',
    textAlign: 'center'
  }
};

const LoadingDialog = (props) => {
  return (
    <Dialog title="Talking with your lamp..." open={props.dialogOpen}>
      <div style={styles.progressbarContainer}>
        <LinearProgress mode="indeterminate" />
      </div>
    </Dialog>
  );
};

LoadingDialog.propTypes = {
  dialogOpen: React.PropTypes.bool.isRequired
};

export default LoadingDialog;
