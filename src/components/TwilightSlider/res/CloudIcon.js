import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import Radium from 'radium';

const CloudIcon = ({style}) => {
  return (
      <SvgIcon
        style={style}
        version="1.1"
        viewBox="0 0 48 48">
        <g transform="translate(-287 298)">
          <g transform="translate(30.513009,162.59619)">
            <path
              d="m 280.5,-445.5 c -2.27,0 -4.11,1.55 -4.72,3.62 -0.69,-0.36 -1.44,-0.62 -2.28,-0.62 -2.76,0 -5,2.24 -5,5 0,0.58 0.16,1.11 0.34,1.62 -1.37,0.78 -2.34,2.19 -2.34,3.88 0,2.48 2.02,4.5 4.5,4.5 l 19,0 c 2.48,0 4.5,-2.02 4.5,-4.5 0,-1.69 -0.97,-3.1 -2.34,-3.88 0.18,-0.51 0.34,-1.04 0.34,-1.62 0,-2.76 -2.24,-5 -5,-5 -0.84,0 -1.59,0.26 -2.28,0.62 -0.61,-2.07 -2.45,-3.62 -4.72,-3.62 z"
              fill="#c4c5c2"
              stroke="#888a85"
              strokeMiterlimit="2" />
            <path
              d="m 292.96,-437.33 c -0.01,2.68 -3.27,3.71 -3.27,3.71 0,0 2.35,-1.63 2.33,-3.71 l 0.94,0 z"
              fill="#888a85"
              fillRule="evenodd" />
          </g>
        </g>
      </SvgIcon>
    );
};

CloudIcon.propTypes = {
  style: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.object),
    React.PropTypes.object
  ])
};

export default Radium(CloudIcon);
