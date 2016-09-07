import React from 'react';
import Radium from 'radium';
import ChannelColor from 'containers/ChannelColor/ChannelColor';

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

const ChannelMap = ({ channels, lampId }) => {
  const leftStrips = [], rightStrips = [];

  for (let i = 1; i <= channels; i++) {
    if (i%2 !== 0) {
      leftStrips.push(
        <ChannelColor
          key={i}
          lampId={lampId}
          stripNumber={i}
          reverse={true} />
      );
    }
    else {
      rightStrips.push(
        <ChannelColor
          key={i}
          lampId={lampId}
          stripNumber={i} />
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
  channels: React.PropTypes.number.isRequired,
  lampId: React.PropTypes.string.isRequired
};

export default Radium(ChannelMap);
