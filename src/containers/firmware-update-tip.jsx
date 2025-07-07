import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import FirmwareUpdateTipComponent from '../components/firmware-update-tip/firmware-update-tip.jsx';

import {
    closeFirmwareUpdateModal
} from '../reducers/modals';

class UpdateTip extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleCancel'
        ]);
    }
    componentWillUnmount () {

    }
    
    handleCancel () {
        this.props.onClose();
    }
    render () {
        return (
            <FirmwareUpdateTipComponent
                onCancel={this.handleCancel}
                {...this.props}
            />
        );
    }
}

UpdateTip.propTypes = {
    onClose: PropTypes.func
};

const mapStateToProps = state => ({
    deviceVersion: state.scratchGui.device.deviceVersion,
    deviceType: state.scratchGui.device.deviceType
});

const mapDispatchToProps = dispatch => ({
    onClose: () => {
        dispatch(closeFirmwareUpdateModal());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UpdateTip);
