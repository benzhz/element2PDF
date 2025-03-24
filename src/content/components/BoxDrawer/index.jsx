import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const BoxDrawer = () => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [endX, setEndX] = useState(0);
    const [endY, setEndY] = useState(0);
    const [boxRef, setBoxRef] = useState(null);

    useEffect(() => {
        const handleMessage = (message) => {
            if (message.action === "startDrawing") {
                setIsDrawing(true);
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);

        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        };
    }, []);

    useEffect(() => {
        if (isDrawing) {
            const startDraw = (e) => {
                setStartX(e.clientX);
                setStartY(e.clientY);
                const newBox = document.createElement('div');
                newBox.style.position = 'absolute';
                newBox.style.border = '2px solid red';
                newBox.style.zIndex = '9999';
                newBox.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
                document.body.appendChild(newBox);
                setBoxRef(newBox);
            };

            const draw = (e) => {
                if (boxRef) {
                    setEndX(e.clientX);
                    setEndY(e.clientY);
                    const width = Math.abs(e.clientX - startX);
                    const height = Math.abs(e.clientY - startY);
                    const left = Math.min(startX, e.clientX);
                    const top = Math.min(startY, e.clientY);
                    boxRef.style.left = left + 'px';
                    boxRef.style.top = top + 'px';
                    boxRef.style.width = width + 'px';
                    boxRef.style.height = height + 'px';
                }
            };

            const endDraw = () => {
                if (boxRef) {
                    setIsDrawing(false);
                    const rect = boxRef.getBoundingClientRect();
                    const selection = document.createRange();
                    selection.selectNodeContents(document.body);
                    const nodes = selection.cloneContents();
                    const div = document.createElement('div');
                    div.appendChild(nodes);
                    const style = document.createElement('style');
                    style.textContent = `
                        * {
                            visibility: hidden;
                        }
                        *:not(html):not(body):not(div) {
                            clip: rect(${rect.top}px, ${rect.right}px, ${rect.bottom}px, ${rect.left}px);
                            position: absolute;
                            visibility: visible;
                        }
                    `;
                    div.appendChild(style);

                    import('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js')
                        .then(() => {
                            html2pdf().from(div).save();
                        })
                        .finally(() => {
                            boxRef.remove();
                        });
                }
            };

            document.addEventListener('mousedown', startDraw);
            document.addEventListener('mousemove', draw);
            document.addEventListener('mouseup', endDraw);

            return () => {
                document.removeEventListener('mousedown', startDraw);
                document.removeEventListener('mousemove', draw);
                document.removeEventListener('mouseup', endDraw);
            };
        }
    }, [isDrawing, startX, startY, boxRef]);

    return <></>;
};