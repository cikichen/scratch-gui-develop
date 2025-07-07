/* eslint-disable import/no-commonjs */
require('./iconfont.js');

const css = require('raw-loader!./facepanel.txt');

const fpStyle = document.querySelector('#mbFp');
if (!(fpStyle instanceof Element)) {
    const head = document.querySelector('head');
    if (head) {
        const style = document.createElement('style');
        style.innerHTML = css;
        style.setAttribute('id', 'mbFp');
        style.setAttribute('type', 'text/css');
        head.appendChild(style);
    }
}

const templateHTML = require('raw-loader!./template.html');

const formatMessageId = function (id) {
    const result = window.matataStore.getState().locales.messages[id];
    return result;
};

export const formatMessage = formatMessageId;
export {templateHTML};
