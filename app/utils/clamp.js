/* @flow */

// function clipping the value in a strict range
const clamp = (value: number, minValue: number, maxValue: number) => Math.min(Math.max(value, minValue), maxValue);

export default clamp;
