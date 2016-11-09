/* eslint-disable */

export class GradientReader {
    constructor(colorStops) {
        const canvas = document.createElement('canvas');
        this.context = canvas.getContext('2d');
        const gr = this.context.createLinearGradient(0, 0, 101, 0);

        canvas.width = 101;
        canvas.height = 1;

        for (let i = 0; i < colorStops.length; i++) {
            const cs = colorStops[i];
            gr.addColorStop(cs.stop, cs.color);
        }

        this.context.fillStyle = gr;
        this.context.fillRect(0, 0, 101, 1);
    }

    getColor(pst) {
        return this.context.getImageData(pst | 0, 0, 1, 1).data;
    }
}

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians)),
    };
};

export const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

    const d = [
        'M', start.x, start.y,
        'A', radius, radius, 0, arcSweep, 0, end.x, end.y,
    ].join(' ');

    return d;
};
