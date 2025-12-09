import React, { memo } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { TextField as TextFieldType, SignatureField } from '@/types'
import 'react-pdf/dist/Page/TextLayer.css'
import FieldsOverlay from './FieldsOverlay'

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
                onLoadSuccess={onPageLoadSuccess}/>
        </Document>
    )
})
PDFViewer.displayName = 'PDFViewer'

interface PDFCanvasProps {
    pdfFile: string | null
    scale: number
    currentPage: number
    textFields: TextFieldType[]
    activeFieldId: string | null
    pdfDimensions: { width: number; height: number }
    onDocumentLoadSuccess: (pdf: any) => void
    onPageLoadSuccess: (page: any) => void
    onCanvasClick: (e: React.MouseEvent) => void
    onFieldClick: (id: string) => void
    onFieldUpdate: (id: string, text: string) => void
    onFieldRemove: (id: string) => void
    onFieldPositionUpdate: (id: string, position: { x: number; y: number }) => void
    onFieldDimensionsUpdate: (id: string, dimensions: { width: number; height: number }) => void
    signatureFields: SignatureField[]
    onSignatureRemove: (id: string) => void
    onSignaturePositionUpdate: (id: string, position: { x: number; y: number }) => void
    onSignatureDimensionsUpdate: (id: string, dimensions: { width: number; height: number }) => void
}

export function PDFCanvas({
    pdfFile,
    scale,
    currentPage,
    textFields,
    activeFieldId,
    pdfDimensions,
    onDocumentLoadSuccess,
    onPageLoadSuccess,
    onCanvasClick,
    onFieldClick,
    onFieldUpdate,
    onFieldRemove,
    onFieldPositionUpdate,
    onFieldDimensionsUpdate,
    signatureFields,
    onSignatureRemove,
    onSignaturePositionUpdate,
    onSignatureDimensionsUpdate,
}: PDFCanvasProps) {
    const scaledWidth = pdfDimensions.width * scale
    const scaledHeight = pdfDimensions.height * scale

    return (
        <div
            className="relative flex flex-1 overflow-hidden"
            onClick={onCanvasClick}>
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
                            onPageLoadSuccess={onPageLoadSuccess}/>

                        {pdfDimensions.width > 0 && (
                            <FieldsOverlay
                                textFields={textFields}
                                signatureFields={signatureFields}
                                currentPage={currentPage}
                                scale={scale}
                                scaledWidth={scaledWidth}
                                scaledHeight={scaledHeight}
                                activeFieldId={activeFieldId}
                                onFieldClick={onFieldClick}
                                onFieldUpdate={onFieldUpdate}
                                onFieldRemove={onFieldRemove}
                                onFieldPositionUpdate={onFieldPositionUpdate}
                                onFieldDimensionsUpdate={onFieldDimensionsUpdate}
                                onSignatureRemove={onSignatureRemove}
                                onSignaturePositionUpdate={onSignaturePositionUpdate}
                                onSignatureDimensionsUpdate={onSignatureDimensionsUpdate}/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
