import {openFirmwareUpdateModal, closeFirmwareUpdateModal} from '../reducers/modals';
import {updateDeviceInfo} from '../reducers/device';

class Matata {
    constructor () {
        this.version = '0.1.0'; // gui 版本号
    }

    /**
     * 显示固件弹窗
     * @param {string} deviceType 设备类型，例如：matatabot | matatacon
     * @param {string} deviceVersion 设备版本号, 例如：10.11.11
     */
    showFirmwareModal (deviceType, deviceVersion) {
        this.updateDeviceInfo({
            deviceType,
            deviceVersion
        });

        window.matataStore.dispatch(openFirmwareUpdateModal());
    }

    hideFirmwareModal () {
        window.matataStore.dispatch(closeFirmwareUpdateModal());
    }

    updateDeviceInfo (deviceInfo) {
        window.matataStore.dispatch(updateDeviceInfo(deviceInfo));
    }
}

const matata = new Matata();
window.matata = matata;

export default matata;
