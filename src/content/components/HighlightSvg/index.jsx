import React from 'react';

const HighlightSvg = (props) => {

    let { clientRects, parentRect } = props;
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

    const pathData = Array.from(clientRects).map((rect, i) => {
        const x = rect.left - minX;
        const y = rect.top - minY;
        const width = rect.width;
        const height = rect.height;
        return `M${x} ${y} L${x + width} ${y} L${x + width} ${y + height} L${x} ${y + height} Z`;
    }).join('');
    return (
        <svg
            id={uniqueId}
            style={{
                "pointer-events": 'none',
                position: 'absolute',
                zIndex: '8888',
                left: `${relativeMinX}px`,
                top: `${relativeMinY}px`,
                width: `${maxX - minX}px`,
                height: `${maxY - minY}px`
            }}
        >
            <path d={pathData} fill="rgba(255, 192, 203, 0.5)" />
        </svg>
    );
};

export default HighlightSvg;