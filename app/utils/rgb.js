// http://stackoverflow.com/a/13542669/1141063
export const shadeRgb = (r, g, b, percent) => {
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;

    const R = Math.round((t - r) * p) + r;
    const G = Math.round((t - g) * p) + g;
    const B = Math.round((t - b) * p) + b;

    return `rgb(${R},${G},${B})`;
};

// if the rgb color brightness is over the threshold (0.85) it returns the darkColor
export const contrastColor = (r, g, b, lightColor, darkColor) => {
    if ((0.2126 * (r / 255)) + (0.7152 * (g / 255)) + (0.0722 * (b / 255)) < 0.85) {
        return lightColor;
    }

    return darkColor;
};
