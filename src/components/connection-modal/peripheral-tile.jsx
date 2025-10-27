import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import bindAll from 'lodash.bindall';
import Box from '../box/box.jsx';
import {
    sanitizeRSSI,
    getSignalLevel
} from '../../lib/ble/signal-utils.js';

import styles from './connection-modal.css';

class PeripheralTile extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleConnecting'
        ]);
    }
    handleConnecting () {
        this.props.onConnecting(this.props.peripheralId);
    }
    render () {
        const sanitizedRSSI = sanitizeRSSI(this.props.rssi);
        const barCount = 8;
        const signalLevel = getSignalLevel(sanitizedRSSI, barCount);
        const signalLabel = sanitizedRSSI === null ? '-- dBm' : `${sanitizedRSSI} dBm`;
        return (
            <Box className={styles.peripheralTile}>
                <Box className={styles.peripheralTileName}>
                    <img
                        className={styles.peripheralTileImage}
                        src={this.props.connectionSmallIconURL}
                    />
                    <Box className={styles.peripheralTileNameWrapper}>
                        <Box className={styles.peripheralTileNameLabel}>
                            {this.props.name || (
                                <FormattedMessage
                                    defaultMessage="Device name"
                                    description="Label for field showing the device name"
                                    id="gui.connection.peripheral-name-label"
                                />
                            )}
                        </Box>
                        <Box className={styles.peripheralTileNameText}>
                            {this.props.peripheralId || this.props.name}
                        </Box>
                    </Box>
                </Box>
                <Box className={styles.peripheralTileWidgets}>
                    <Box
                        className={classNames(styles.signalStrengthMeter, {
                            [styles.signalStrengthMeterStale]: this.props.isStale
                        })}
                        title={this.props.isStale ? `${signalLabel} (stale)` : signalLabel}
                    >
                        {Array.from({length: barCount}).map((_, index) => {
                            const displayIndex = index + 1;
                            const barHeight = `${(displayIndex / barCount) * 100}%`;
                            return (
                                <div
                                    key={displayIndex}
                                    className={classNames(styles.signalBar, {
                                        [styles.signalBarActive]: index < signalLevel
                                    })}
                                    style={{height: barHeight}}
                                />
                            );
                        })}
                    </Box>
                    <Box className={styles.signalStrengthLabel}>
                        {this.props.isStale ? `${signalLabel} ...` : signalLabel}
                    </Box>
                    <button
                        onClick={this.handleConnecting}
                    >
                        <FormattedMessage
                            defaultMessage="Connect"
                            description="Button to start connecting to a specific device"
                            id="gui.connection.connect"
                        />
                    </button>
                </Box>
            </Box>
        );
    }
}

PeripheralTile.propTypes = {
    connectionSmallIconURL: PropTypes.string,
    name: PropTypes.string,
    onConnecting: PropTypes.func,
    peripheralId: PropTypes.string,
    rssi: PropTypes.number,
    isStale: PropTypes.bool
};

PeripheralTile.defaultProps = {
    isStale: false
};

export default PeripheralTile;
