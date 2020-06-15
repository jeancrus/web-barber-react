import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BallonPopover } from './style';

export default function Ballon({
    children,
    anchorEl,
    handleClose,
    anchorOrigin,
    transformOrigin,
    open,
}) {
    return (
        <BallonPopover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
        >
            <div className="container">{children}</div>
        </BallonPopover>
    );
}

Ballon.propTypes = {
    children: PropTypes.node.isRequired,

    anchorEl: PropTypes.shape({
        component: PropTypes.instanceOf(React.Component),
    }),

    handleClose: PropTypes.func.isRequired,

    anchorOrigin: PropTypes.objectOf(PropTypes.string),
    transformOrigin: PropTypes.objectOf(PropTypes.string),
};

Ballon.defaultProps = {
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
    },
    anchorEl: null,
    transformOrigin: {
        vertical: 'top',
        horizontal: 'center',
    },
};
