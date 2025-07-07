import {templateHTML, formatMessage} from './sources';
import {
    TRANSPARENT_MAP_COLORS,
    colorItemTemplate,
    EDITOR_SPACING,
    MAP_WHITE_COLOR_BORDER
} from './config';
import FaceCanvas from './editor/canvas';

export default class Editor {
    constructor (config) {
        this._config = config;
        this._container = null;
        this._field = '';
        this._canvas = new FaceCanvas(this._config);
        this.render();
    }

    get actions () {
        return {
            CHANGE_COLOR: (index, ele) => {
                if (ele instanceof HTMLElement) {
                    index = Number(index);
                    if (this._container) {
                        if (!ele.classList.contains('color-item-selected')) {
                            this.switchColorByIndex(index);
                        }
                        this.switchToEditMode();
                    }
                }
            },
            CANCEL: () => {
                this.close();
            },
            OK: () => {
                const field = this._field;
                const facedata = this.canvas.faceData;
                if (field && field.setValue) {
                    const setValue = field.setValue;
                    if (typeof setValue === 'function') {
                        setValue.call(field, facedata.toString());
                    }
                }
                this.close();
            }
        };
    }

    render () {
        const {
            guid = 'default',
            showNumber = true,
            colorIndex = 1,
            boxspacing = EDITOR_SPACING,
            multiColor = true,
            bgimg
        } = this._config;
        const id = `facepanel_${guid.replace(/-/g, '')}`;
        let container = document.querySelector(`#${id}`);
        if (!(container instanceof Element)) {
            container = document.createElement('section');
            container.setAttribute('id', id);
            container.setAttribute('class', 'facepanel facepanel-hide');
            container.innerHTML = templateHTML;

            this._axisContainer = container.querySelector(
                '.fp-axis'
            );
            this._svgContainer = container.querySelector(
                '.fp-svg-canvas'
            );
            this._colorsContainer = container.querySelector(
                '.color-list'
            );
            this._okBtn = container.querySelector(
                'button[data-action="OK"]'
            );
            this._cancelBtn = container.querySelector(
                'button[data-action="CANCEL"]'
            );

            if (this._colorsContainer instanceof HTMLElement) {
                if (multiColor === true) {
                    this._colorsContainer.innerHTML = this.genColorsContent().join(
                        ''
                    );
                } else {
                    this._colorsContainer.remove();
                }
            }

            if (this._svgContainer instanceof HTMLElement) {
                this._svgContainer.appendChild(this.canvas.canvasElement);
                if (bgimg) {
                    const url = typeof bgimg === 'string' ? bgimg : bgimg.url;
                    if (url) {
                        this._svgContainer.style.backgroundImage = `url(${url})`;
                    }
                }
                this._svgContainer.style.padding = `${boxspacing}px`;
            }

            if (this._axisContainer instanceof Element) {
                this._axisContainer.innerHTML = this.canvas.panel.axisElements.join(
                    ''
                );
                if (!showNumber) {
                    this._axisContainer.classList.add('fp-axis-hide');
                }
            }

            this.canvas.colorIndex = colorIndex;

            this.addEventListener(container);

            document.body.appendChild(container);
        }
        this._container = container;
    }

    addEventListener (container) {
        if (container) {
            container.addEventListener(
                'click',
                ev => {
                    const actionsHandler = this.actions;
                    let ele = ev.srcElement;
                    if (actionsHandler) {
                        while (ele instanceof Element) {
                            const action =
                                ele.getAttribute('data-action') || '';
                            if (action !== '') {
                                if (
                                    actionsHandler[action] &&
                                    typeof actionsHandler[action] === 'function'
                                ) {
                                    const actiondata = ele.getAttribute(
                                        'data-action-value'
                                    );
                                    actionsHandler[action](
                                        actiondata || '',
                                        ele
                                    );
                                }
                                break;
                            }
                            ele = ele.parentElement;
                        }
                    }
                },
                false
            );
        }
    }

    get canvas () {
        return this._canvas;
    }

    preview (data) {
        const facedata = this.canvas.faceData;
        if (!data) {
            data = this.canvas.panel.emptyFacedata.join('');
        }
        if (data && data !== facedata) {
            this.canvas.faceData = data;
        }
    }

    open (data, field) {
        this._field = field;
        this.preview(data);
        this.updateButtonText();
        setTimeout(() => {
            if (this._container instanceof HTMLElement) {
                this._container.style.visibility = 'visible';
                this._container.classList.remove('facepanel-hide');
                this._container.classList.add('facepanel-show');
            }
        }, 0);
    }

    close () {
        if (this._field) {
            this._field = null;
        }
        if (this._container instanceof HTMLElement) {
            this._container.style.visibility = 'hidden';
            this._container.classList.remove('facepanel-show');
            this._container.classList.add('facepanel-hide');
        }
        this.switchColorByIndex(1);
    }

    genColorsContent () {
        const {colors, colorIndex = 1} = this._config;
        return colors.map((color, index) => {
            const bgColor = color;
            const isWhite =
                TRANSPARENT_MAP_COLORS.indexOf(color.toUpperCase()) >= 0;
            const boxShadow = '';
            if (isWhite) {
                color = MAP_WHITE_COLOR_BORDER;
            } else {
                color = '#fff';
            }
            return colorItemTemplate(
                color,
                bgColor,
                boxShadow,
                index,
                index === colorIndex
            );
        });
    }

    switchToEditMode () {
        if (this._container instanceof HTMLElement) {
            const radio = this._container.querySelector(
                '[data-action="DRAW"] > input[type="radio"]'
            );
            if (radio instanceof HTMLInputElement) {
                this.canvas.mode = 'DRAW';
                radio.click();
            }
        }
    }

    switchColorByIndex (index) {
        if (this._container) {
            const {multiColor} = this._config;
            if (multiColor) {
                this.canvas.colorIndex = index;
                this._container
                    .querySelectorAll('[data-action=CHANGE_COLOR]')
                    .forEach(ele => {
                        const idx = ele.getAttribute('data-action-value');
                        if (Number(idx) === index) {
                            ele.classList.add('color-item-selected');
                        } else {
                            ele.classList.remove('color-item-selected');
                        }
                    });
            }
        }
    }

    updateButtonText () {
        if (this._okBtn instanceof HTMLElement) {
            const text = formatMessage('gui.modal.ok');
            if (this._okBtn.innerText !== text && text) {
                this._okBtn.innerText = text;
            }
        }
        if (this._cancelBtn instanceof HTMLElement) {
            const text = formatMessage('gui.modal.cancel');
            if (this._cancelBtn.innerText !== text && text) {
                this._cancelBtn.innerText = text;
            }
        }
    }
}
