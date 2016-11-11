import React from 'react';
import Radium from 'radium';
import SvgIcon from 'material-ui/SvgIcon';
import { describeArc } from 'app/utils/gradient';

const DayGradientIcon = ({ style, radius, borderWidth, colors }) => {
    const halfBorder = borderWidth / 2;
    const diameter = radius * 2;
    const viewBox = `${-halfBorder} ${-halfBorder} ${diameter + borderWidth} ${diameter + borderWidth}`;
    const transform = `translate(${radius},${radius}) rotate(180, 0, 0)`;

    return (
        <SvgIcon viewBox={viewBox} style={style}>
            <defs>
                <linearGradient
                    id="firstLinearGradient"
                    gradientUnits="objectBoundingBox"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="0.8"
                >
                    <stop offset="0%" stopColor={colors[0]} />
                    <stop offset="100%" stopColor={colors[1]} />
                </linearGradient>
                <linearGradient
                    id="secondLinearGradient"
                    gradientUnits="objectBoundingBox"
                    x1="1"
                    y1="0"
                    x2="0"
                    y2="0.5"
                >
                    <stop offset="0%" stopColor={colors[1]} />
                    <stop offset="100%" stopColor={colors[2]} />
                </linearGradient>
                <linearGradient
                    id="thirdLinearGradient"
                    gradientUnits="objectBoundingBox"
                    x1="1"
                    y1="0.5"
                    x2="0"
                    y2="0"
                >
                    <stop offset="0%" stopColor={colors[2]} />
                    <stop offset="100%" stopColor={colors[3]} />
                </linearGradient>
                <linearGradient
                    id="fourthLinearGradient"
                    gradientUnits="objectBoundingBox"
                    x1="0"
                    y1="0.8"
                    x2="0"
                    y2="0"
                >
                    <stop offset="0%" stopColor={colors[3]} />
                    <stop offset="100%" stopColor={colors[4]} />
                </linearGradient>
            </defs>
            <g fill="none" strokeWidth={borderWidth} transform={transform}>
                <path d={describeArc(0, 0, radius, 45, 112)} stroke="url(#firstLinearGradient)" />
                <path d={describeArc(0, 0, radius, 111, 180)} stroke="url(#secondLinearGradient)" />
                <path d={describeArc(0, 0, radius, 179, 247)} stroke="url(#thirdLinearGradient)" />
                <path d={describeArc(0, 0, radius, 246, 315)} stroke="url(#fourthLinearGradient)" />
            </g>
        </SvgIcon>
    );
};

DayGradientIcon.propTypes = {
    style: React.PropTypes.object,
    radius: React.PropTypes.number.isRequired,
    borderWidth: React.PropTypes.number.isRequired,
    colors: React.PropTypes.array.isRequired,
};

export default Radium(DayGradientIcon);
