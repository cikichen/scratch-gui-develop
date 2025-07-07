import SvgEditor from './index';
import {EDITOR_SPACING, CELL_MAX_WIDTH} from '../config';

export default class RingPanel extends SvgEditor {
    constructor (config, faceData) {
        super(config, faceData);
        const {
            size: {width = CELL_MAX_WIDTH},
            count = 12,
            interval = 0
        } = config;
        this.angle = (2 * Math.PI) / count;
        this.r = (width || CELL_MAX_WIDTH) / 2;
        this.R = (this.r + interval) / Math.sin(this.angle / 2);
        this.x0 = this.r + this.R;
        this.y0 = this.x0;
    }

    geneator () {
        const {
            size: {width = CELL_MAX_WIDTH},
            count = 12,
            offsetCount = 1,
            offset = CELL_MAX_WIDTH,
            boxspacing = EDITOR_SPACING
        } = this.config;
        const {angle, r, R, x0, y0, faceData} = this;
        for (let index = 0; index < count; index++) {
            const sinV = Math.sin((index + offsetCount) * angle);
            const cosV = Math.cos((index + offsetCount) * angle);
            const x = x0 + (R * sinV) + 1;
            const y = y0 - (R * cosV) + 1;
            const colorIndex = faceData[index] || 0;
            const attrs = {
                r: r,
                cx: x,
                cy: y,
                dataindex: index
            };
            this.addCellElement(attrs, colorIndex, 'circle');
            const xs = x0 + ((R - (offset || CELL_MAX_WIDTH)) * sinV) + 1;
            const ys = y0 - ((R - (offset || CELL_MAX_WIDTH)) * cosV) + 1;
            const offsetX = -((width || CELL_MAX_WIDTH) / 2) + 1;
            const offsetY = offsetX;
            this.addAxisPoint(
                index,
                boxspacing + ys + offsetY,
                boxspacing + xs + offsetX
            );
        }
        this.boxWidth = (Math.round(R + r) * 2) + 2;
        this.boxHeight = this.boxWidth;
    }
}
