import leftPad from 'left-pad';

const currifiedPad = (width: number, z: string = '0') => (n: number) => leftPad(n, width, z);

export default currifiedPad;
