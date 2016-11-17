// http://stackoverflow.com/a/13542669/1141063
export default (r, g, b, percent) => {
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;

    const R = Math.round((t - r) * p) + r;
    const G = Math.round((t - g) * p) + g;
    const B = Math.round((t - b) * p) + b;

    return `rgb(${R},${G},${B})`;
};
