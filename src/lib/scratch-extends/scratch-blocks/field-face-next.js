/* eslint-disable no-console */
/* eslint-disable no-mixed-operators */

import Blockly from 'scratch-blocks';
import FacePanel from './field-face';
import {faceDataToSvg} from './field-face/util';

const config = {
    actions: [],
    bgimg: {name: 'matataconn.png', url: 'static/matataconn.png'},
    boxspacing: 20,
    colorIndex: 1,
    colors: ['#ffffff', '#ff0000', '#ffA500', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#8000ff', '#000000'],
    columns: 16,
    count: 12,
    create_time: 1584582917,
    defaultFace: '',
    defaultFaces: ['234567888881'],
    defaultValue: '234567888881',
    enableAnimation: false,
    ftype: 2,
    guid: '9d03c0b1',
    id: '1',
    interval: 30,
    modify_time: 1584582917,
    multiColor: true,
    name: 'ledRing',
    offsetCount: 1,
    radius: 12,
    rows: 8,
    showNumber: false,
    size: {width: 16, height: 16},
    sort: 999,
    startNumber: 1,
    type: 'field_paneleditor',
    uid: 1111
};

const cacheFacePanel = {};

class FieldPanelEditor extends Blockly.Field {
    constructor (options) {
        super();
        this.options = options;
    }

    willInit () {
        this.setValue(this.getValue());
    }

    getValue () {
        const {
            defaultValue,
            ftype = 0,
            count = 10,
            rows = 8,
            colums = 16
        } = this.options;
        return (
            this.data_ ||
            defaultValue ||
            new Array(ftype === 0 ? rows * colums : count).fill(0)
                .join('')
        );
    }

    setValue (data) {
        try {
            if (!data || this.data_ === data) {
                return;
            }
            if (
                Blockly.Events.isEnabled() &&
                this.sourceBlock_ &&
                this.data_ !== data
            ) {
                Blockly.Events.fire(
                    new Blockly.Events.BlockChange(
                        this.sourceBlock_,
                        'field',
                        this.name,
                        this.data_,
                        data
                    )
                );
            }
            this.data_ = data;
            this.render_();
        } catch (error) {
            console.warn(error);
        }
    }

    render_ () {
        if (this.fieldGroup_ && this.options) {
            const svgElement = faceDataToSvg(
                this.options,
                this.data_,
                32,
                true
            );
            if (svgElement instanceof SVGElement) {
                const width = Number(svgElement.getAttribute('width'));
                const height = Number(svgElement.getAttribute('height'));
                const xml = svgElement.outerHTML;
                this.size_.width = width;
                this.size_.height = height;
                if (this.fieldGroup_.innerHTML !== xml) {
                    this.fieldGroup_.innerHTML = xml;
                }
                if (this.sourceBlock_ && this.sourceBlock_.rendered) {
                    this.sourceBlock_.render();
                }
            }
        }
    }

    showEditor_ () {
        if (this.options) {
            const data = this.getValue();
            const {guid} = this.options;
            let facepanel;
            if (cacheFacePanel.hasOwnProperty(guid)) {
                facepanel = cacheFacePanel[guid];
                console.log({cache: facepanel});
            } else {
                facepanel = cacheFacePanel[guid] = new FacePanel(
                    this.options,
                    data
                );
                console.log({new: facepanel});
            }
            facepanel.open(data, this);
        }
    }
}

FieldPanelEditor.fromJson = function (options) {
    options = config;
    return new FieldPanelEditor(options);
};


Blockly.Field.register('field_face', FieldPanelEditor);

Blockly.Blocks.face = {
    /**
     * Block for matrix value.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: '%1',
            args0: [
                {
                    type: 'field_face',
                    name: 'FACE'
                }
            ],
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            output: 'Number',
            extensions: ['colours_pen']
        });
    }
};
