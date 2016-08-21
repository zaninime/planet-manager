import React, { Component } from 'react';
import Radium from 'radium';
import { ListItem } from 'material-ui/List';
import PlayCircleFilled from 'material-ui/svg-icons/av/play-circle-filled';
import LoadingDialog from 'views/main/connect/LoadingDialog/LoadingDialog';

var styles = {
  listItem: {
    paddingLeft: '3.5em'
  }
};

class DiscoveryList extends Component {
  constructor(props){
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);

    this.state = { dialogOpen: false };
  }

  handleOnClick(){
    this.setState({ dialogOpen: true });
  }

  render(){
    const { lamps } = this.props;
    const self = this;

    return (
      <div>
        {Object.keys(lamps).map(function(value) {
          return (
            <ListItem
              style={styles.listItem}
              rightIcon={<PlayCircleFilled />}
              key={value}
              onClick={self.handleOnClick}>
              {lamps[value].address}
            </ListItem>
          );
        })}
        <LoadingDialog dialogOpen={this.state.dialogOpen}/>
      </div>
    );
  }
}

DiscoveryList.propTypes = {
  lamps: React.PropTypes.array.isRequired
};

export default Radium(DiscoveryList);
