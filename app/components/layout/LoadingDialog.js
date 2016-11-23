import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';
import shallowCompare from 'react-addons-shallow-compare';
import DialogTitle from '../presentational/DialogTitle';

const styles = {
    progressbarContainer: {
        margin: '1em',
        textAlign: 'center',
    },
    unselectableDialog: {
        userSelect: 'none',
    },
};

class LoadingDialog extends Component {
    constructor(props) {
        super(props);

        this.state = { open: this.props.isLoadingDialogOpen };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ open: nextProps.isLoadingDialogOpen });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        return (
            <Dialog
                title={<DialogTitle title="Talking with your lamp" />}
                open={this.state.open}
                style={styles.unselectableDialog}
            >
                <div style={styles.progressbarContainer}>
                    <LinearProgress mode="indeterminate" />
                </div>
            </Dialog>
        );
    }
}

LoadingDialog.propTypes = {
    isLoadingDialogOpen: React.PropTypes.bool.isRequired,
};

export default LoadingDialog;
