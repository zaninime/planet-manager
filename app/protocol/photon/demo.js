/* @flow */

import { floorIntensity } from './constants';

/* eslint-disable no-mixed-operators */
export default (color: number, intensity: number) => {
    const x = color;
    const i = intensity;

    const red = 100 * (floorIntensity + Math.max(i * (1 - floorIntensity) * (-x), 0));
    let green;
    if ((x >= -1 && x < -0.5) || (x > 0.5 && x <= 1)) {
        green = 100 * ((2 / 3) * (floorIntensity + i * (1 - floorIntensity) * (1 - (Math.abs(x)))));
    } else if (x >= -0.5 && x <= 0.5) {
        green = 100 * ((2 / 3) * (floorIntensity + i * (1 - floorIntensity) * ((3 / 4) - Math.abs(x / 2))));
    }

    const blue = 100 * (floorIntensity + Math.max(i * (1 - floorIntensity) * (x), 0));
    const white = 100 * (floorIntensity + i * (1 - floorIntensity) * (1 - Math.abs(x)));
    return { white, red, green, blue };
};
/* eslint-enable no-mixed-operators */
