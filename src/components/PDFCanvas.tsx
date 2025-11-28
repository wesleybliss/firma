import React from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import Draggable from 'react-draggable'
import { PanelsTopLeft, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TextField, SignatureField } from '@/types'

import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface PDFViewerProps {
    file: string | null
    scale: number
    pageNumber: number
    onDocumentLoadSuccess: (pdf: any) => void
    onPageLoadSuccess: (page: any) => void
}

const PDFViewer = React.memo(({ file, scale, pageNumber, onDocumentLoadSuccess, onPageLoadSuccess }: PDFViewerProps) => {
    return (
        <Document
            file={file}
            className="drop-shadow-xl"
            loading={
                <div className="flex h-64 w-64 items-center justify-center text-sm text-slate-500">
                    Rendering PDF…
                </div>
            }
            onLoadSuccess={onDocumentLoadSuccess}
        >
            <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onLoadSuccess={onPageLoadSuccess}
            />
        </Document>
    )
})
PDFViewer.displayName = 'PDFViewer'

interface PDFCanvasProps {
    pdfFile: string | null
    scale: number
    currentPage: number
    textFields: TextField[]
    activeFieldId: string | null
    pdfDimensions: { width: number; height: number }
    onDocumentLoadSuccess: (pdf: any) => void
    onPageLoadSuccess: (page: any) => void
    onCanvasClick: (e: React.MouseEvent) => void
    onFieldClick: (id: string) => void
    onFieldUpdate: (id: string, text: string) => void
    onFieldRemove: (id: string) => void
    onFieldPositionUpdate: (id: string, position: { x: number; y: number }) => void
    getNodeRef: (id: string) => React.RefObject<HTMLDivElement>
    signatureFields: SignatureField[]
    onSignatureRemove: (id: string) => void
    onSignaturePositionUpdate: (id: string, position: { x: number; y: number }) => void
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
    getNodeRef,
    signatureFields,
    onSignatureRemove,
    onSignaturePositionUpdate,
}: PDFCanvasProps) {
    const scaledWidth = pdfDimensions.width * scale
    const scaledHeight = pdfDimensions.height * scale

    return (
        <div
            className="relative flex flex-1 items-center justify-center rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-2xl backdrop-blur"
            onClick={onCanvasClick}
        >
            <div className="relative h-full w-full overflow-auto rounded-2xl border border-slate-200/60 bg-slate-50 p-6 shadow-inner">
                <div className="flex justify-center">
                    <div
                        className="relative inline-block"
                        style={{
                            width: scaledWidth || undefined,
                            height: scaledHeight || undefined,
                        }}
                    >
                        <PDFViewer
                            file={pdfFile}
                            scale={scale}
                            pageNumber={currentPage}
                            onDocumentLoadSuccess={onDocumentLoadSuccess}
                            onPageLoadSuccess={onPageLoadSuccess}
                        />

                        {pdfDimensions.width > 0 && (
                            <div
                                className="pointer-events-none absolute left-0 top-0"
                                style={{
                                    width: scaledWidth,
                                    height: scaledHeight,
                                }}
                            >
                                {textFields.filter(f => f.page === currentPage).map(field => {
                                    const nodeRef = getNodeRef(field.id)
                                    const isActive = activeFieldId === field.id
                                    const showChrome = isActive || field.isNew

                                    return (
                                        <Draggable
                                            key={`${field.id}-${scale}`}
                                            nodeRef={nodeRef}
                                            handle=".drag-handle"
                                            defaultPosition={{
                                                x: field.x * scaledWidth,
                                                y: field.y * scaledHeight,
                                            }}
                                            onStop={(_, data) => onFieldPositionUpdate(field.id, data)}
                                            bounds="parent"
                                        >
                                            <div
                                                ref={nodeRef}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onFieldClick(field.id)
                                                }}
                                                className={cn(
                                                    'pointer-events-auto absolute flex items-center gap-1 rounded p-1 transition-colors',
                                                    showChrome
                                                        ? 'z-50 border border-sky-500 bg-white shadow-sm ring-1 ring-sky-500'
                                                        : 'z-10 border border-transparent hover:border-slate-300 hover:bg-white/50'
                                                )}
                                            >
                                                <div className={cn("drag-handle cursor-grab p-0.5 text-slate-400 hover:text-slate-600 active:cursor-grabbing", !showChrome && "opacity-0 group-hover:opacity-100")}>
                                                    <PanelsTopLeft className="size-3" />
                                                </div>
                                                <input
                                                    id={`field-${field.id}`}
                                                    value={field.text}
                                                    onFocus={() => onFieldClick(field.id)}
                                                    onClick={() => onFieldClick(field.id)}
                                                    onChange={event => onFieldUpdate(field.id, event.target.value)}
                                                    className="h-6 min-w-[80px] max-w-[300px] border-0 bg-transparent p-0 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0"
                                                    placeholder="Type here..."
                                                    style={{
                                                        width: `${Math.max(field.text.length, 10)}ch`,
                                                        fontFamily: field.fontFamily,
                                                        fontSize: `${field.fontSize}px`,
                                                        color: field.color,
                                                        fontWeight: field.isBold ? 'bold' : 'normal',
                                                        fontStyle: field.isItalic ? 'italic' : 'normal',
                                                        textDecoration: [
                                                            field.isUnderline ? 'underline' : '',
                                                            field.isStrikethrough ? 'line-through' : ''
                                                        ].filter(Boolean).join(' ')
                                                    }}
                                                />
                                                {showChrome && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onFieldRemove(field.id);
                                                        }}
                                                        className="ml-1 rounded-sm p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                                    >
                                                        <Trash2 className="size-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </Draggable>
                                    )
                                })}
                            </div>
                        )}

                        {pdfDimensions.width > 0 && (
                            <div
                                className="pointer-events-none absolute left-0 top-0"
                                style={{
                                    width: scaledWidth,
                                    height: scaledHeight,
                                }}
                            >
                                {signatureFields.filter(f => f.page === currentPage).map(field => {
                                    const nodeRef = getNodeRef(field.id)
                                    const isActive = activeFieldId === field.id
                                    const showChrome = isActive || field.isNew

                                    return (
                                        <Draggable
                                            key={`${field.id}-${scale}`}
                                            nodeRef={nodeRef}
                                            handle=".drag-handle"
                                            defaultPosition={{
                                                x: field.x * scaledWidth,
                                                y: field.y * scaledHeight,
                                            }}
                                            onStop={(_, data) => onSignaturePositionUpdate(field.id, data)}
                                            bounds="parent"
                                        >
                                            <div
                                                ref={nodeRef}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onFieldClick(field.id)
                                                }}
                                                className={cn(
                                                    'pointer-events-auto absolute flex items-center gap-1 rounded p-1 transition-colors',
                                                    showChrome
                                                        ? 'z-50 border border-sky-500 bg-white/10 shadow-sm ring-1 ring-sky-500'
                                                        : 'z-10 border border-transparent hover:border-slate-300 hover:bg-white/10'
                                                )}
                                                style={{
                                                    width: field.width * scale,
                                                    height: field.height * scale,
                                                }}
                                            >
                                                <div className={cn("drag-handle absolute -left-3 -top-3 cursor-grab p-1 text-slate-400 hover:text-slate-600 active:cursor-grabbing", !showChrome && "opacity-0 group-hover:opacity-100")}>
                                                    <div className="rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
                                                        <PanelsTopLeft className="size-3" />
                                                    </div>
                                                </div>

                                                <img
                                                    src={field.dataUrl}
                                                    alt="Signature"
                                                    className="h-full w-full object-contain"
                                                    draggable={false}
                                                />

                                                {showChrome && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onSignatureRemove(field.id);
                                                        }}
                                                        className="absolute -right-3 -top-3 rounded-full bg-white p-1 text-slate-400 shadow-sm ring-1 ring-slate-200 hover:bg-red-50 hover:text-red-500"
                                                    >
                                                        <Trash2 className="size-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </Draggable>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
