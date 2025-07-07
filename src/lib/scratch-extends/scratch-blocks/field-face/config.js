export const SVGNS = 'http://www.w3.org/2000/svg';

export const EDITOR_SPACING = 24;
export const AXIS_SIZE = 20;
export const CELL_MAX_WIDTH = 32;
export const CELL_STROKE_WIDTH = 0.5;
export const CELL_STROKE_COLOR = '#E0E5EB';
export const CELL_FILL_COLOR = '#F9F9F9';
export const CELL_TAG_NAME = ['RECT', 'CIRCLE'];

export const LINEAR_OFFSET = 0;
export const LINEAR_MAX_ROWCOUNT = 8;
export const PREVIEW_SVG_HEIGHT = 48;
export const FACEPANEL_MAX = {
    COL: 32,
    ROW: 32
};

/**
 * LocalStorage 缓存的 KEY
 */
export const CACHE_FACEPANE_KEY = 'CACHE_FACE_DATA';

/**
 * 白色映射表
 */
export const TRANSPARENT_MAP_COLORS = ['#FFFFFF', '#FFF', '#ffffff', '#fff'];
export const MAP_WHITE_COLOR_BORDER = '#BCDAFB';

/**
 * 表情面板配置
 */
export const CONFIG = {
    guid: 'default',
    colors: ['#FFFFFF', '#00B9FF'],
    colorIndex: 1,
    columns: 16,
    enableAnimation: false,
    interval: 3,
    multiColor: false,
    radius: 8,
    rows: 8,
    showNumber: true,
    size: {
        width: CELL_MAX_WIDTH,
        height: CELL_MAX_WIDTH
    },
    startNumber: 0,
    ftype: 0
};

export const colorItemTemplate = (color, bgColor, boxShadow, index, selected) => (
    `<span class="color-list-item ${selected ? 'color-item-selected' : ''}"
        data-action="CHANGE_COLOR"
        data-action-value="${index}">
        <label class="color-item"
            style="color: ${color}; background-color: ${bgColor};">
            <svg class="fp-icon"><use xlink:href="#iconcheck"></use></svg>
        </label>
    </span>`
);
