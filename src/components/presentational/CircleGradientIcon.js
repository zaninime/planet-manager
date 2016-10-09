import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import { describeArc } from 'utils/utils';

const CircleGradientIcon = ({style, radius, borderWidth, firstColor, secondColor}) => {
  const halfBorder = borderWidth / 2;
  const diameter = radius * 2;
  const viewBox=`${ -halfBorder } ${ -halfBorder } ${ diameter + borderWidth } ${ diameter + borderWidth }`;
  const transform = "translate(" + radius + "," + radius + ")" + "rotate(180, 0, 0)";

  return (
    <SvgIcon viewBox={viewBox} style={style}>
      <defs>
        <linearGradient id="linearGradient" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor={secondColor}/>
          <stop offset="100%" stopColor={firstColor}/>
        </linearGradient>
      </defs>
      <g fill="none" strokeWidth={borderWidth} transform={transform}>
        <path d={describeArc(0, 0, radius, 45, 315)} stroke="url(#linearGradient)" />
      </g>
    </SvgIcon>
  );
};

CircleGradientIcon.propTypes = {
  style: React.PropTypes.object,
  radius: React.PropTypes.number.isRequired,
  borderWidth: React.PropTypes.number.isRequired,
  firstColor: React.PropTypes.string.isRequired,
  secondColor: React.PropTypes.string.isRequired
};

export default CircleGradientIcon;
