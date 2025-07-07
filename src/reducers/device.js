/**
 * 存储设备的相关信息，用于扩展与主界面的相关UI交互
 */

const UPDATE_DEVICE_INFO = 'device/UPDATE_DEVICE_INFO';

const initialState = {
    deviceType: 'matatabot',
    deviceVersion: ''
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case UPDATE_DEVICE_INFO:
        return Object.assign(initialState, action.info);
    default:
        return state;
    }
};

const updateDeviceInfo = info => ({
    type: UPDATE_DEVICE_INFO,
    info: info
});

export {
    reducer as default,
    initialState as deviceInitialState,
    updateDeviceInfo
};
