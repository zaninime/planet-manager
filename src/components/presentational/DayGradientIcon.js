import React from 'react';
import Radium from 'radium';
import SvgIcon from 'material-ui/SvgIcon';
import { describeArc } from 'utils/gradient';

const DayGradientIcon = ({style, radius, borderWidth, firstColor, secondColor, thirdColor, fourthColor}) => {
  const halfBorder = borderWidth / 2;
  const diameter = radius * 2;
  const viewBox=`${ -halfBorder } ${ -halfBorder } ${ diameter + borderWidth } ${ diameter + borderWidth }`;
  const transform = "translate(" + radius + "," + radius + ")" + "rotate(180, 0, 0)";

  return (
    <SvgIcon viewBox={viewBox} style={style}>
      <defs>
        <linearGradient id="firstLinearGradient" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={firstColor}/>
          <stop offset="100%" stopColor={secondColor}/>
        </linearGradient>
        <linearGradient id="secondLinearGradient" gradientUnits="objectBoundingBox" x1="1" y1="1" x2="0" y2="1">
          <stop offset="0%" stopColor={secondColor}/>
          <stop offset="100%" stopColor={thirdColor}/>
        </linearGradient>
        <linearGradient id="thirdLinearGradient" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={thirdColor}/>
          <stop offset="100%" stopColor={fourthColor}/>
        </linearGradient>
      </defs>
      <g fill="none" strokeWidth={borderWidth} transform={transform}>
        <path d={describeArc(0, 0, radius, 45, 135)} stroke="url(#firstLinearGradient)"/>
        <path d={describeArc(0, 0, radius, 135, 225)} stroke="url(#secondLinearGradient)"/>
        <path d={describeArc(0, 0, radius, 225, 315)} stroke="url(#thirdLinearGradient)"/>
      </g>
    </SvgIcon>
  );
};

DayGradientIcon.propTypes = {
  style: React.PropTypes.object,
  radius: React.PropTypes.number.isRequired,
  borderWidth: React.PropTypes.number.isRequired,
  firstColor: React.PropTypes.string.isRequired,
  secondColor: React.PropTypes.string.isRequired,
  thirdColor: React.PropTypes.string.isRequired,
  fourthColor: React.PropTypes.string.isRequired,
};

export default Radium(DayGradientIcon);
