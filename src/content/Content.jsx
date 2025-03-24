import React, { useRef, useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf/dist/jspdf.umd.js';

const Content = () => {
    const maskRef = useRef(null); // New reference for the mask layer
    const currentHighlightedElement = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const [promptText, setPromptText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedElement, setSelectedElement] = useState();
    const [showPaginationModal, setShowPaginationModal] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'q') {
                setIsListening(true);
                setShowPrompt(true);
                setPromptText('Move the mouse to the element you want to operate on and click to export.');
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (isListening) {
            // Create the mask layer element
            if (!maskRef.current) {
                const mask = document.createElement('div');
                mask.style.position = 'fixed';
                mask.style.top = 0;
                mask.style.left = 0;
                mask.style.width = '100vw';
                mask.style.height = '100vh';
                mask.style.pointerEvents = 'none'; // Does not affect mouse events
                mask.style.zIndex = 99999; // Highest level
                document.body.appendChild(mask);
                maskRef.current = mask;
            }

            const handleMouseMove = (event) => {
                const targetElement = event.target.closest('*:not([data-no-highlight])'); // Exclude elements that do not need to be highlighted
                if (targetElement && targetElement!== currentHighlightedElement.current) {
                    // Remove the old highlight
                    if (currentHighlightedElement.current) {
                        removeHighlight(currentHighlightedElement.current);
                    }
                    // Apply the new highlight
                    applyHighlight(targetElement, event);
                    currentHighlightedElement.current = targetElement;
                }
            };

            const handleMouseOut = () => {
                if (currentHighlightedElement.current) {
                    removeHighlight(currentHighlightedElement.current);
                    currentHighlightedElement.current = null;
                }
            };

            const applyHighlight = (element, event) => {
                const rect = element.getBoundingClientRect();

                // Update the mask layer style
                maskRef.current.style.display = 'block';
                maskRef.current.innerHTML = `
                    <div style="position: absolute; top: ${rect.top}px; left: ${rect.left}px; 
                    width: ${rect.width}px; height: ${rect.height}px; 
                    outline: 2px solid red; outline-offset: 2px;
                    box-shadow: 0 0 15px 8px rgba(255, 0, 0, 0.4);
                    pointer-events: none; z-index: 99999;"></div>
                `;
            };

            const removeHighlight = () => {
                maskRef.current.style.display = 'none';
                maskRef.current.innerHTML = '';
            };

            const handleClick = async (event) => {
                event.preventDefault();
                event.stopPropagation();
                const selected = event.target;
                if (currentHighlightedElement.current) {
                    removeHighlight(currentHighlightedElement.current);
                    currentHighlightedElement.current = null;
                }
                setIsListening(false);
                setShowPrompt(false);
                setPromptText('');
                setSelectedElement(selected);

                if (!PDFSHIFT_API_KEY) {
                    setShowPaginationModal(true);
                } else {
                    setShowExportModal(true);
                }
            };

            // Event binding
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseleave', handleMouseOut);
            document.addEventListener('click', handleClick);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseleave', handleMouseOut);
                document.removeEventListener('click', handleClick);
                // Clean up the mask layer
                if (maskRef.current) {
                    document.body.removeChild(maskRef.current);
                    maskRef.current = null;
                }
            };
        }
    }, [isListening]);

    // Define a recursive function to process each element and its children
    const processElement = (element) => {
        const cloneElement = element.cloneNode(true);
        // Use getComputedStyle to get all computed styles
        const computedStyles = window.getComputedStyle(element);

        // Create a "clean" element to get default styles
        const defaultElement = document.createElement(element.tagName);
        document.body.appendChild(defaultElement); // Insert into the DOM to ensure styles take effect
        const defaultStyles = window.getComputedStyle(defaultElement);

        // Convert to key-value pairs and filter out default styles
        let inlineStyleString = "";
        for (let i = 0; i < computedStyles.length; i++) {
            const property = computedStyles[i];
            const computedValue = computedStyles.getPropertyValue(property).trim();
            const defaultValue = defaultStyles.getPropertyValue(property).trim();

            // If the current style value is different from the default value, record it
            if (computedValue!== defaultValue) {
                inlineStyleString += `${property}: ${computedValue}; `;
            }
        }

        // Remove the temporarily created default element
        document.body.removeChild(defaultElement);

        // Clear the original class and style attributes
        cloneElement.removeAttribute("class");
        cloneElement.removeAttribute("style");

        // Set the obtained styles as inline styles
        cloneElement.setAttribute("style", inlineStyleString);

        // Recursively process all child elements
        Array.from(cloneElement.children).forEach(child => processElement(child));

        return cloneElement;
    }

    const PDFSHIFT_API_KEY = ''; // Please replace with your own PDFShift API key
    const PDFSHIFT_API_URL = 'https://api.pdfshift.io/v3/convert/pdf';

    const handleExportWithPDFShift = async () => {
        try {
            setIsLoading(true);
            const newElement = processElement(selectedElement);
            const elementHtml = newElement.outerHTML;
            const htmlContent = `<!DOCTYPE html><html><head></head><body>${elementHtml}</body></html>`;

            const response = await fetch(PDFSHIFT_API_URL, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${btoa(`api:${PDFSHIFT_API_KEY}`)}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    source: htmlContent,
                    landscape: false,
                    use_print: true
                })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error('HTTP request error, status code:', response.status, 'Error details:', errorBody);
                throw new Error(`HTTP error! status: ${response.status}, Error details: ${errorBody}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'selected_element.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error occurred while generating PDF:', error.message);
            alert(`Error occurred while generating PDF: ${error.message}`);
        } finally {
            setIsLoading(false);
            setShowExportModal(false);
            setShowPaginationModal(false);
        }
    };

    const handleExportWithJSPDF = async (isPaginated) => {
        try {
            if (!selectedElement) {
                return;
            }
            setIsLoading(true);
            setShowPaginationModal(false);
            const canvas = await html2canvas(selectedElement, {
                useCORS: true
            });
            const imgData = canvas.toDataURL('image/png');
            if (isPaginated) {
                const pdf = new jsPDF();
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                const pageHeight = pdf.internal.pageSize.getHeight();
                let pageCount = Math.ceil(pdfHeight / pageHeight);

                for (let i = 0; i < pageCount; i++) {
                    if (i > 0) {
                        pdf.addPage();
                    }
                    const y = -i * pageHeight;
                    pdf.addImage(imgData, 'PNG', 0, y, pdfWidth, pdfHeight);
                }
                pdf.save('selected_element.pdf');
            } else {
                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save('selected_element.pdf');
            }
        } catch (error) {
            console.error('Error occurred while generating PDF using jspdf and html2canvas:', error.message);
            alert(`Error occurred while generating PDF using jspdf and html2canvas: ${error.message}`);
        } finally {
            setIsLoading(false);

        }
    };

    return (
        <div>
            {isLoading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '5px'
                    }}>
                        Generating PDF, please wait...
                    </div>
                </div>
            )}
            {showPrompt && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    zIndex: 9999
                }}>
                    {promptText}
                </div>
            )}
            <Modal
                title="Select export method"
                visible={showExportModal}
                onCancel={() => setShowExportModal(false)}
                footer={[
                    <Button key="pdfshift" onClick={() => {
                        handleExportWithPDFShift();
                    }}>
                        Export using PDFShift
                    </Button>,
                    <Button key="jspdf" onClick={() => {
                        setShowExportModal(false);
                        setShowPaginationModal(true);
                    }}>
                        Export using jspdf and html2canvas
                    </Button>
                ]}
            >
                Please select the export method to use.
            </Modal>
            <Modal
                title="Select pagination method"
                visible={showPaginationModal}
                onCancel={() => setShowPaginationModal(false)}
                footer={[
                    <Button key="paginated" onClick={() => handleExportWithJSPDF(true)}>
                        Paginated
                    </Button>,
                    <Button key="non-paginated" onClick={() => handleExportWithJSPDF(false)}>
                        Non-paginated
                    </Button>
                ]}
            >
                Please select whether to export with pagination.
            </Modal>
        </div>
    );
};

export default Content;