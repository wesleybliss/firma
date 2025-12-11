import React, { memo, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import FieldsOverlay from './FieldsOverlay'
import { usePdfStore } from '@/store/pdf'
import { useCanvasStore } from '@/store/canvas'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface PDFViewerProps {
    file: string | null
    scale: number
    pageNumber: number
    onDocumentLoadSuccess: (pdf: any) => void
    onPageLoadSuccess: (page: any) => void
}

const PDFViewer = memo(({ file, scale, pageNumber, onDocumentLoadSuccess, onPageLoadSuccess }: PDFViewerProps) => {
    return (
        <Document
            file={file}
            className="drop-shadow-xl"
            loading={
                <div className="flex h-64 w-64 items-center justify-center text-sm text-slate-500">
                    Rendering PDF…
                </div>
            }
            onLoadSuccess={onDocumentLoadSuccess}>
            <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onLoadSuccess={onPageLoadSuccess} />
        </Document>
    )
})
PDFViewer.displayName = 'PDFViewer'

export function PDFCanvas() {
    const {
        pdfFile,
        scale,
        currentPage,
        pdfDimensions,
        setNumPages,
        setPdfDimensions,
    } = usePdfStore()

    const {
        textFields,
        activeFieldId,
        signatureFields,
        setActiveFieldId,
        updateTextField,
        removeTextField,
        updateFieldPosition,
        updateFieldDimensions,
        removeSignatureField,
        updateSignaturePosition,
        updateSignatureDimensions,
        deselectAll,
    } = useCanvasStore()

    const onDocumentLoadSuccess = useCallback((pdf: any) => {
        setNumPages(pdf.numPages)
    }, [setNumPages])

    const onPageLoadSuccess = useCallback((page: any) => {
        setPdfDimensions({
            width: page.originalWidth,
            height: page.originalHeight,
        })
    }, [setPdfDimensions])

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.react-pdf__Page')) {
            deselectAll()
        }
    }

    const scaledWidth = pdfDimensions.width * scale
    const scaledHeight = pdfDimensions.height * scale

    return (
        <div
            className="relative flex flex-1 overflow-hidden"
            onClick={handleCanvasClick}>
            <div className="relative h-full w-full overflow-auto py-2">
                <div className="flex min-h-full items-center justify-center">
                    <div
                        className="relative inline-block"
                        style={{
                            width: scaledWidth || undefined,
                            height: scaledHeight || undefined,
                        }}>
                        <PDFViewer
                            file={pdfFile}
                            scale={scale}
                            pageNumber={currentPage}
                            onDocumentLoadSuccess={onDocumentLoadSuccess}
                            onPageLoadSuccess={onPageLoadSuccess} />

                        {pdfDimensions.width > 0 && (
                            <FieldsOverlay
                                textFields={textFields}
                                signatureFields={signatureFields}
                                currentPage={currentPage}
                                scale={scale}
                                scaledWidth={scaledWidth}
                                scaledHeight={scaledHeight}
                                activeFieldId={activeFieldId}
                                onFieldClick={setActiveFieldId}
                                onFieldUpdate={updateTextField}
                                onFieldRemove={removeTextField}
                                onFieldPositionUpdate={updateFieldPosition}
                                onFieldDimensionsUpdate={updateFieldDimensions}
                                onSignatureRemove={removeSignatureField}
                                onSignaturePositionUpdate={updateSignaturePosition}
                                onSignatureDimensionsUpdate={updateSignatureDimensions} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
