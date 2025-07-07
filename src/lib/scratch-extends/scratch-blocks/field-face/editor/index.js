/* eslint-disable quote-props */
/* eslint-disable max-len */
import {TRANSPARENT_MAP_COLORS, CELL_STROKE_WIDTH, CELL_STROKE_COLOR, CELL_MAX_WIDTH, CELL_FILL_COLOR} from '../config';

export default class SvgEditor {
    constructor (config, faceData) {
        this.config = config;
        this._faceData = faceData;
        this.cellElements = [];
        this.axisElements = [];
    }

    get emptyFaceData () {
        const {count = 12} = this.config;
        const faceData = Array(count).fill(0);
        return faceData;
    }

    get faceData () {
        if (this._faceData) return this._faceData.split('').map(d => Number(d));
        return this.emptyFaceData;
    }

    set faceData (faceData) {
        this._faceData = faceData.join('');
    }

    addCellElement (attrs, colorIndex = 0, tag) {
        const html = this.createSvgElementHtml({
            ...this.cellDftAttr(colorIndex),
            ...attrs
        }, tag);
        this.cellElements.push(html);
    }

    addAxisPoint (index, top, left, w, h, color) {
        const {size: {width = CELL_MAX_WIDTH, height = CELL_MAX_WIDTH}, startNumber = 0} = this.config;
        const attrs = {
            width: `${w || width}px`,
            height: `${h || height}px`,
            top: `${top}px`,
            left: `${left}px`,
            'line-height': `${h || height}px`
        };
        if (color) {
            attrs.color = color;
        }
        const html = this.createAxisNoElementHtml(`${index + startNumber}`, attrs);
        this.axisElements.push(html);
    }

    createSvgElementHtml (attrs, tag = 'rect', innerText) {
        const attrsString = [];
        if (typeof attrs === 'object') {
            for (const key in attrs) {
                attrsString.push(`${key}="${attrs[key]}"`);
            }
        }
        return `<${tag} ${attrsString.join(' ')}>${innerText || ''}</${tag}>`;
    }

    cellDftAttr (colorIndex = 0) {
        const {colors} = this.config;
        const color = colors[colorIndex] || TRANSPARENT_MAP_COLORS[0];
        const isWhite = TRANSPARENT_MAP_COLORS.indexOf(color) >= 0;
        return {
            'fill': isWhite ? CELL_FILL_COLOR : color,
            'stroke-width': CELL_STROKE_WIDTH * 2,
            'stroke': isWhite ? CELL_STROKE_COLOR : color
        };
    }

    createAxisNoElementHtml (text, style) {
        const styleString = [];
        for (const key in style) {
            styleString.push(`${key}: ${style[key]}`);
        }
        return `<span class="axis-point" style="${styleString.join('; ')}">${text}</span>`;
    }
}
