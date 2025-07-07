/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import {SVGNS, PREVIEW_SVG_HEIGHT, CONFIG, CELL_MAX_WIDTH} from './config';
import RingPanel from './editor/ring';
import SvgEditor from './editor/index';

export const createSvgElement = (attrs, tag = 'circle') => {
    const ele = document.createElementNS(SVGNS, tag);
    if (typeof attrs === 'object') {
        for (const key in attrs) {
            ele.setAttribute(key, attrs[key]);
        }
    }
    return ele;
};

export function faceDataToSvg (config, data, showHeight = PREVIEW_SVG_HEIGHT, isPreview = false) {
    config = Object.assign({}, CONFIG, config);
    config.count = Math.min(config.count || 3, CELL_MAX_WIDTH);
    const panel = new RingPanel(config, data);
    if (panel instanceof SvgEditor) {
        panel.geneator(data.length, panel.faceData, isPreview);
    }
    const {boxHeight = 100, boxWidth = 100} = panel;
    const attrs = {
        style: `display: block; cursor: pointer;`,
        width: boxWidth * (showHeight / boxHeight),
        height: showHeight,
        viewBox: `0 0 ${boxWidth} ${boxHeight}`
    };
    const svg = createSvgElement(attrs, 'svg');
    const rect = createSvgElement({
        width: boxWidth || 100,
        height: boxHeight || 100,
        x: 0,
        y: 0,
        rx: 4,
        ry: 4,
        fill: 'rgba(255, 255, 255, .5)'
    }, 'rect');
    if (panel.cellElements instanceof Array && panel.cellElements.length > 0) {
        svg.innerHTML = `${rect.outerHTML}${panel.cellElements.join('')}`;
    }
    return svg;
}

export const svgElementToBase64 = svgElement => {
    if (svgElement) {
        return `data:image/svg+xml;base64,${window.btoa(new XMLSerializer().serializeToString(svgElement))}`;
    }
    return '';
};

export function faceDataToImage (config, data, showHeight = PREVIEW_SVG_HEIGHT) {
    const canvasElement = faceDataToSvg(config, data, showHeight);
    const src = svgElementToBase64(canvasElement);
    return src;
}

export function faceDataToImages (config, faceData) {
    const images = [];
    if (faceData instanceof Array) {
        faceData.forEach(face => {
            if (face && typeof face.data === 'string') {
                images.push(faceDataToImage(config, face.data));
            }
        });
    }
    return images;
}

export const svgTextToBase64 = svgXmlString => {
    const data = window.encodeURIComponent(svgXmlString);
    return `data:image/svg+xml,${data}`;
};

export const createAxisNoElement = (text, style) => {
    const dftStyle = {
        display: 'block',
        position: 'absolute',
        textAlign: 'center',
        pointerEvents: 'none',
        userSelect: 'none'
    };
    const span = document.createElement('span');
    span.innerText = text;
    Object.assign(style, dftStyle);
    for (const key in style) {
        if (span.style.hasOwnProperty(key)) {
            span.style[key] = style[key];
        }
    }
    return span;
};

export const facepanelHtmlTemplate = (svgContainerPadding, canvasMargin, actionPadding) => `
<section class="fp-modal-mask" data-action="CANCEL"></section>
<section class="fp-modal">
    <a class="fp-modal-close fp-btn-action" data-action="CANCEL">
        <svg class="fp-icon close-icon">
            <use xlink:href="#iconclose"></use>
        </svg>
    </a>
    <section class="fp-modal-content">
        <section class="color-list"></section>
        <section class="fp-editor">
            <section class="fp-editor-container">
                <section class="fp-editor-content">
                    <section class="fp-canvas-content">
                        <section class="fp-svg-canvas" style="padding: ${svgContainerPadding};margin: ${canvasMargin}"></section>
                        <section class="fp-axis"></section>
                    </section>
                </section>
                <section class="fp-preset-container fp-preset-slides"></section>
            </section>
            <section class="fp-actions" style="padding: ${actionPadding}"></section>
        </section>
        <section class="fp-modal-footer">
            <button class="btn-fp-ok fp-btn-action" data-action="OK">
                <svg class="fp-icon ok-icon">
                    <use xlink:href="#iconcheck"></use>
                </svg>
            </button>
        </section>
    </section>
</section>`;
