import React, { Component } from 'react';
import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import ManualConnectionDialog from 'containers/ManualConnectionDialog/ManualConnectionDialog';

class ManualConnectionItem extends Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);

    this.state = { dialogOpen: false };
  }

  handleOnClick() {
    this.setState({ dialogOpen: true });
  }

  handleRequestClose() {
    this.setState({ dialogOpen: false });
  }

  render() {
    return (
      <div>
        <ListItem leftAvatar={<Avatar>M</Avatar>} onClick={this.handleOnClick}>
          Connect manually
        </ListItem>
        <ManualConnectionDialog
          dialogOpen={this.state.dialogOpen}
          onRequestClose={this.handleRequestClose}/>
      </div>
    );
  }
}

export default ManualConnectionItem;
