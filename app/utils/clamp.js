// function clipping the value in a strict range
export default (value, minValue, maxValue) => Math.min(Math.max(value, minValue), maxValue);
