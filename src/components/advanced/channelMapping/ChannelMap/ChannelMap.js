import React from 'react';
import Radium from 'radium';
import BoundChannelColor from 'containers/advanced/channelMapping/BoundChannelColor/BoundChannelColor';

const styles = {
  container: {
    width: '100%',
    display: 'inline-block'
  },
  leftStrips: {
    width: '45%',
    float: 'left'
  },
  rightStrips: {
    width: '45%',
    float: 'right'
  }
};

const ChannelMap = ({channels}) => {
  const leftStrips = [], rightStrips = [];

  for (let i = 1; i <= channels; i++) {
    if (i%2 !== 0) {
      leftStrips.push(
        <BoundChannelColor key={i} stripNumber={i} reverse={true}/>
      );
    }
    else {
      rightStrips.push(
        <BoundChannelColor key={i} stripNumber={i}/>
      );
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.leftStrips}>
        {leftStrips}
      </div>
      <div style={styles.rightStrips}>
        {rightStrips}
      </div>
    </div>
  );
};

ChannelMap.propTypes = {
  channels: React.PropTypes.number.isRequired
};

export default Radium(ChannelMap);
