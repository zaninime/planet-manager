import React from 'react';
import Radium from 'radium';
import TimePicker from 'material-ui/TimePicker';

import sunriseImg from './res/sunrise.png';
import sunsetImg from './res/sunset.png';

const styles = {
  timePicker: {
    width: '3em',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  timeTextField: {
    width: '3em'
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: '100'
  },
  subtitle: {
    textTransform: 'uppercase',
    position: 'relative',
    top: '-1em',
    color: 'gray'
  },
  image: {
    height: '4em',
    width: 'auto',
    margin: 'auto'
  },
  imageContainer: {
    width: '50%',
    float: 'left'
  },
  timepickerContainer: {
    textTransform: 'none',
    width: '50%'
  },
  errorContainer: {
    fontSize: '.75em',
    color: '#f44336',
    transition: 'all 450ms',
  },
  container: {
    display: 'flex'
  }
};

const Timer = ({type, value, onChange, errorText = ''}) => {
  let subtitle = 'on';
  let img = sunriseImg;
  styles.imageContainer.order = '1';
  styles.timepickerContainer.order = '2';

  if (type === 'sunset'){
    img = sunsetImg;
    subtitle = 'off';
    styles.imageContainer.order = '2';
    styles.timepickerContainer.order = '1';
  }

  let errorContainer = null;

  if (type === 'sunset'){
    errorContainer = (
      <div style={styles.errorContainer}>
        {errorText}
      </div>
    );
  }

  return (
    <div>
      <h2 style={styles.title}>{type}</h2>
      <p style={styles.subtitle}>{subtitle}</p>
      <div style={styles.container}>
        <div style={styles.imageContainer}>
          <img src={img} style={styles.image} />
        </div>
        <div style={styles.timepickerContainer}>
          <TimePicker
            name={type}
            style={styles.timePicker}
            onChange={onChange}
            value={value}
            errorText={errorText.lenght > 0 ? ' ': ''}
            textFieldStyle={styles.timeTextField}
            format="24hr"/>

          {errorContainer}
        </div>
      </div>
    </div>
  );
};

Timer.propTypes = {
  type: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.object,
  errorText: React.PropTypes.string
};

export default Radium(Timer);
