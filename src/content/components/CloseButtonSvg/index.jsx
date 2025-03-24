// CloseButtonSvg.js
import React from 'react';

const CloseButtonSvg = (props ) => {
    let { clientRects, parentRect, onClose } = props;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < clientRects.length; i++) {
        const rect = clientRects[i];
        minX = Math.min(minX, rect.left);
        minY = Math.min(minY, rect.top);
        maxX = Math.max(maxX, rect.left + rect.width);
        maxY = Math.max(maxY, rect.top + rect.height);
    }

    const relativeMinX = minX - parentRect.left;
    const relativeMinY = minY - parentRect.top;

    const uniqueId = `highlight-${Date.now()}`;

    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            style={{
                position: 'absolute',
                top: `${relativeMinY - 10}px`,
                left: `${relativeMinX + (maxX - minX) - 10}px`,
                cursor: 'pointer',
                zIndex: '9999'
            }}
            id={`close-${uniqueId}`}
            onClick={onClose}
        >
            <path d="M2 2 L18 18 M2 18 L18 2" stroke="#ff4d4d" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
};

export default CloseButtonSvg;