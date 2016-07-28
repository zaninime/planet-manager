import React, { PropTypes as T } from 'react';
import FlatButton from 'material-ui/FlatButton';
import {red100, red500, green100, green500, blue100, blue500, blueGrey50, blueGrey100} from 'material-ui/styles/colors';

const colors = {
  redBackground: red100,
  redHover: red500,
  redText: 'white',

  greenBackground: green100,
  greenHover: green500,
  greenText: 'white',

  blueBackground: blue100,
  blueHover: blue500,
  blueText: 'white',

  whiteBackground: blueGrey50,
  whiteHover: blueGrey100,
  whiteText: 'white',

  offBackground: undefined,
  offHover: undefined,
  offText: undefined,
};

const labels = {
  red: 'red',
  green: 'green',
  blue: 'blue',
  white: 'white',
  off: 'off'
};

export default function ChannelColor(props) {
  const backgroundColor = colors[props.color + 'Background'];
  const hoverColor = colors[props.color + 'Hover'];
  const textColor = colors[props.color + 'Text'];
  const label = labels[props.color];
  return (
    <FlatButton label={label}
    backgroundColor={backgroundColor}
    hoverColor={hoverColor}
    labelStyle={{color: textColor}}
    style={props.style}
    onClick={props.onClick}/>
  );
}

ChannelColor.propTypes = {
  color: (props, name, component) => {
    if (!/^(?:red|green|blue|white|off)$/.test(props[name])) {
      return new Error(`Invalid prop 'color' supplied to ${component}. Must be one of {red, green, blue, white, off}`);
    }
  },
  style: T.object,
  onClick: T.func
};
