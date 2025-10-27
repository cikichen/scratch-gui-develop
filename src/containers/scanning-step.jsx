import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import ScanningStepComponent from '../components/connection-modal/scanning-step.jsx';
import VM from 'scratch-vm';
import {sanitizeRSSI} from '../lib/ble/signal-utils.js';

const STALE_THRESHOLD_MS = 6000;
const EXPIRATION_THRESHOLD_MS = 15000;
const AUTO_RESCAN_INTERVAL_MS = 8000;
const MAINTENANCE_TICK_MS = 2000;

class ScanningStep extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handlePeripheralListUpdate',
            'handlePeripheralScanTimeout',
            'handleRefresh',
            'handleMaintenanceTick',
            'startScan',
            'publishPeripheralList'
        ]);
        this.state = {
            scanning: true,
            peripheralList: []
        };
        this._peripheralMap = {};
        this._maintenanceIntervalId = null;
        this._lastListUpdate = 0;
        this._lastScanRequest = 0;
    }
    componentDidMount () {
        this.startScan();
        this.props.vm.on(
            'PERIPHERAL_LIST_UPDATE', this.handlePeripheralListUpdate);
        this.props.vm.on(
            'PERIPHERAL_SCAN_TIMEOUT', this.handlePeripheralScanTimeout);
        this._maintenanceIntervalId = window.setInterval(
            this.handleMaintenanceTick,
            MAINTENANCE_TICK_MS
        );
    }
    componentWillUnmount () {
        // @todo: stop the peripheral scan here
        this.props.vm.removeListener(
            'PERIPHERAL_LIST_UPDATE', this.handlePeripheralListUpdate);
        this.props.vm.removeListener(
            'PERIPHERAL_SCAN_TIMEOUT', this.handlePeripheralScanTimeout);
        if (this._maintenanceIntervalId) {
            window.clearInterval(this._maintenanceIntervalId);
            this._maintenanceIntervalId = null;
        }
    }
    handlePeripheralScanTimeout () {
        this.setState({
            scanning: false,
            peripheralList: []
        });
        this._peripheralMap = {};
    }
    handlePeripheralListUpdate (newList) {
        const now = Date.now();
        let hasChanges = false;
        Object.keys(newList).forEach(id => {
            const incoming = newList[id];
            const previous = this._peripheralMap[id] || {};
            const merged = {
                ...previous,
                ...incoming,
                lastSeen: now
            };
            this._peripheralMap[id] = merged;
            if (!previous || previous.rssi !== merged.rssi || previous.name !== merged.name) {
                hasChanges = true;
            }
        });

        this._lastListUpdate = now;

        if (hasChanges || Object.keys(newList).length > 0) {
            this.publishPeripheralList();
        } else {
            // 即使无数据变化，也需要刷新 stale 状态
            this.publishPeripheralList();
        }
    }
    handleRefresh () {
        this.startScan();
    }
    handleMaintenanceTick () {
        const now = Date.now();
        let removed = false;
        Object.keys(this._peripheralMap).forEach(id => {
            if (now - this._peripheralMap[id].lastSeen > EXPIRATION_THRESHOLD_MS) {
                delete this._peripheralMap[id];
                removed = true;
            }
        });

        if (removed) {
            this.publishPeripheralList();
        } else if (this.state.peripheralList.length > 0) {
            // 状态可能从“新鲜”变为“过期”，需要刷新一次
            const shouldUpdate = this.state.peripheralList.some(item => {
                const record = this._peripheralMap[item.peripheralId];
                if (!record) return true;
                const isStale = now - record.lastSeen > STALE_THRESHOLD_MS;
                return item.isStale !== isStale;
            });
            if (shouldUpdate) {
                this.publishPeripheralList();
            }
        }

        const shouldRescan = (now - this._lastListUpdate > AUTO_RESCAN_INTERVAL_MS) &&
            (now - this._lastScanRequest > AUTO_RESCAN_INTERVAL_MS);

        if (shouldRescan) {
            this.startScan(true);
        }
    }
    startScan (preserveList = false) {
        this.props.vm.scanForPeripheral(this.props.extensionId);
        this._lastScanRequest = Date.now();
        if (preserveList) {
            if (!this.state.scanning) {
                this.setState({scanning: true});
            }
            return;
        }
        this._peripheralMap = {};
        this.setState({
            scanning: true,
            peripheralList: []
        });
    }
    publishPeripheralList () {
        const now = Date.now();
        const peripheralArray = Object.keys(this._peripheralMap).map(id => {
            const entry = this._peripheralMap[id];
            return {
                ...entry,
                peripheralId: entry.peripheralId || id,
                isStale: now - entry.lastSeen > STALE_THRESHOLD_MS
            };
        }).sort((a, b) => {
            const rssiA = sanitizeRSSI(a.rssi);
            const rssiB = sanitizeRSSI(b.rssi);

            if (rssiA === null && rssiB === null) {
                return b.lastSeen - a.lastSeen;
            }
            if (rssiA === null) return 1;
            if (rssiB === null) return -1;

            if (rssiA !== rssiB) {
                return rssiB - rssiA;
            }

            return b.lastSeen - a.lastSeen;
        });
        this.setState({peripheralList: peripheralArray});
    }
    render () {
        return (
            <ScanningStepComponent
                connectionSmallIconURL={this.props.connectionSmallIconURL}
                peripheralList={this.state.peripheralList}
                phase={this.state.phase}
                scanning={this.state.scanning}
                title={this.props.extensionId}
                onConnected={this.props.onConnected}
                onConnecting={this.props.onConnecting}
                onRefresh={this.handleRefresh}
            />
        );
    }
}

ScanningStep.propTypes = {
    connectionSmallIconURL: PropTypes.string,
    extensionId: PropTypes.string.isRequired,
    onConnected: PropTypes.func.isRequired,
    onConnecting: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default ScanningStep;
