import SvgEditor from './index';
import {
    CONFIG,
    TRANSPARENT_MAP_COLORS,
    CELL_STROKE_COLOR,
    CELL_TAG_NAME,
    CELL_FILL_COLOR
} from '../config';
import RingPanel from './ring';
import {createSvgElement} from '../util';

export default class FaceCanvas {
    constructor (config) {
        this.config = Object.assign({}, CONFIG, config);
        this.canvasElement = null;
        this.panel = null;
        this._changeColorCallback = null;
        this.isMouseDown = false;
        this.createCanvas();
    }

    get axisPoints () {
        return this._axisPoints;
    }

    set axisPoints (list) {
        this._axisPoints = list;
    }

    get colorIndex () {
        return this._colorIndex;
    }

    set colorIndex (index) {
        this._colorIndex = index;
    }

    set faceData (data) {
        const datas = data.split('').map(num => Number(num));
        if (this.panel && datas.length) {
        
            const selector = 'circle';
            const eles = this.canvasElement.querySelectorAll(selector);
            eles.forEach(ele => {
                const dataIndex = Number(ele.getAttribute('dataindex')) || 0;
                const colorIndex = datas[dataIndex];
                const {colors} = this.config;
                const color = colors[colorIndex] || colors[0];
                this.changeAxisPointColor(dataIndex, color);
                const isWhite = TRANSPARENT_MAP_COLORS.indexOf(color) >= 0;
                const fill = isWhite ? CELL_FILL_COLOR : color;
                const stroke = isWhite ? CELL_STROKE_COLOR : color;
                ele.setAttribute('fill', fill);
                ele.setAttribute('stroke', stroke);
            });
            this.panel.faceData = datas;
        }
    }

    get faceData () {
        return this.panel.faceData.join('');
    }

    createCanvas () {
        if (!(this.canvasElement instanceof SVGAElement)) {
            this.panel = new RingPanel(this.config);
            if (this.panel) {
                this.panel.geneator();
                let {boxWidth, boxHeight, cellElements} = this.panel;
                boxWidth = boxWidth % 2 === 0 ? boxWidth : boxWidth + 1;
                boxHeight = boxHeight % 2 === 0 ? boxHeight : boxHeight + 1;
                const attrs = {
                    class: 'fp-svg',
                    style: 'background-color: transparent;',
                    width: boxWidth,
                    height: boxHeight,
                    viewBox: `0 0 ${boxWidth} ${boxHeight}`
                };
                this.canvasElement = createSvgElement(
                    attrs,
                    'svg'
                );
                this.addEventListeners();
                if (
                    this.panel instanceof SvgEditor &&
                    cellElements.length > 0
                ) {
                    this.canvasElement.innerHTML = cellElements.join('');
                }
            }
        }
    }

    addEventListeners () {
        const listeners = {
            mousedown: this.handleMouseDown.bind(this),
            mouseup: this.handleMouseUp.bind(this),
            mousemove: this.handleMouseMove.bind(this),
            mouseleave: this.handleMouseOut.bind(this),
            touchstart: this.handleMouseDown.bind(this),
            touchend: this.handleMouseUp.bind(this),
            touchmove: this.handleMouseMove.bind(this)
        };
        for (const key in listeners) {
            this.canvasElement.addEventListener(key, listeners[key]);
        }
    }

    handleMouseDown (e) {
        e.preventDefault();
        const target = e.srcElement;
        this.isMouseDown = true;
        this.changeColor(target);
    }

    handleMouseUp (e) {
        e.preventDefault();
        this.isMouseDown = false;
    }

    handleMouseMove (e) {
        e.preventDefault();
        if (this.isMouseDown) {
            let target;
            if (e instanceof TouchEvent) {
                if (!e.touches) {
                    return;
                }
                target = document.elementFromPoint(
                    e.touches[0].clientX,
                    e.touches[0].clientY
                );
            } else {
                target = e.srcElement;
            }
            this.changeColor(target, 'move');
        }
    }

    handleMouseOut (e) {
        e.preventDefault();
        this.handleMouseUp(e);
    }

    set changeColorCallback (callback) {
        this._changeColorCallback = callback;
    }

    get changeColorCallback () {
        return this._changeColorCallback;
    }

    changeColor (target, type) {
        if (target) {
            const {tagName} = target;
            if (CELL_TAG_NAME.indexOf(tagName.toUpperCase()) >= 0) {
                const dataIndex = Number(target.getAttribute('dataindex')) || 0;
                if (
                    !type ||
                    (type === 'move' && dataIndex !== this.mouseOverIndex)
                ) {
                    this.mouseOverIndex = dataIndex;
                    const {colors} = this.config;
                    const currentColor = target.getAttribute('fill') || '';
                    const currentColorIndex = colors.indexOf(currentColor);
                    const isHighLight = currentColorIndex !== 0;
                    let colorIndex =
                        isHighLight && currentColorIndex === this.colorIndex ?
                            0 :
                            this.colorIndex;
                    if (this._mode === 'ERASE') {
                        colorIndex = 0;
                    }
                    const color = colors[colorIndex];
                    this.changeAxisPointColor(dataIndex, color);
                    const isWhite = TRANSPARENT_MAP_COLORS.indexOf(color) >= 0;
                    const fill = isWhite ? CELL_FILL_COLOR : color;
                    const stroke = isWhite ? CELL_STROKE_COLOR : color;
                    target.setAttribute('fill', fill);
                    target.setAttribute('stroke', stroke);
                    const faceData = this.panel.faceData;
                    faceData[dataIndex] = colorIndex;
                    this.panel.faceData = faceData;
                    const callback = this.changeColorCallback;
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            }
        }
    }

    changeAxisPointColor (index, color) {
        if (this.axisPoints instanceof NodeList) {
            const ele = this.axisPoints.item(index);
            const isWhite = TRANSPARENT_MAP_COLORS.indexOf(color) >= 0;
            if (ele instanceof HTMLElement) {
                const nextColor = isWhite ? '#405471' : '#FFF';
                const currentColor = ele.style.color;
                if (nextColor !== currentColor) {
                    ele.style.color = nextColor;
                }
            }
        }
    }
}
