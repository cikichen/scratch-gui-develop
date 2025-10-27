const RSSI_MIN = -100;
const RSSI_MAX = -20;
const RESOLUTION = RSSI_MAX - RSSI_MIN;

/**
 * 过滤异常或哨兵 RSSI 值。
 * @param {number} rawRSSI 原始 RSSI
 * @return {?number} 合法 RSSI，非法时返回 null
 */
export const sanitizeRSSI = rawRSSI => {
    if (typeof rawRSSI !== 'number' || Number.isNaN(rawRSSI)) {
        return null;
    }
    // Scratch Link 在 macOS/Windows 上常用 127 表示无效 RSSI。
    if (rawRSSI === 127 || rawRSSI === 0) {
        return null;
    }
    // 有些适配器会返回正值（代表尚未获取到），与实际 dBm 不符。
    if (rawRSSI > 0) {
        return null;
    }
    return rawRSSI;
};

/**
 * 将 RSSI 归一化到 [0, 1] 区间。
 * @param {?number} rssi RSSI
 * @return {number} 归一化结果
 */
const normalizeRSSI = rssi => {
    if (rssi === null) return 0;
    const clamped = Math.min(RSSI_MAX, Math.max(RSSI_MIN, rssi));
    return (clamped - RSSI_MIN) / RESOLUTION;
};

/**
 * 将 RSSI 映射到 0~N 档的信号等级。
 * @param {?number} rssi RSSI
 * @param {number} barCount 档位数量
 * @return {number} 信号档位
 */
export const getSignalLevel = (rssi, barCount = 4) => {
    if (rssi === null) return 0;
    const safeBarCount = Math.max(1, barCount);
    const normalized = normalizeRSSI(rssi);
    const bars = Math.ceil(normalized * safeBarCount);
    return Math.min(safeBarCount, Math.max(1, bars));
};

/**
 * 计算信号强度百分比，便于渲染渐变或数值。
 * @param {?number} rssi RSSI
 * @return {number} 百分比（0~100）
 */
export const getSignalPercentage = rssi => Math.round(normalizeRSSI(rssi) * 100);
