export const pad = (n, width, z = '0') => {
  n = n + '';
  if (n.length >= width) return n;
  else return new Array(width - n.length + 1).join(z) + n;
};

export const currifiedPad = (width, z = '0') => n => pad(n, width, z);
