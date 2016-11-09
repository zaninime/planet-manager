/* @flow */

export const pad = (n: number, width: number, z: string = '0') => {
    const stringNum = `${n}`;
    if (stringNum.length >= width) return stringNum;
    return new Array(width + -stringNum.length + 1).join(z) + stringNum;
};

export const currifiedPad = (width: number, z: string = '0') => (n: number) => pad(n, width, z);
