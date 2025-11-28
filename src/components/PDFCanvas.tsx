import React from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Rnd } from 'react-rnd'
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
    onFieldDimensionsUpdate: (id: string, dimensions: { width: number; height: number }) => void
    getNodeRef: (id: string) => React.RefObject<HTMLDivElement>
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
    getNodeRef,
    signatureFields,
    onSignatureRemove,
    onSignaturePositionUpdate,
    onSignatureDimensionsUpdate,
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
                                    const isActive = activeFieldId === field.id
                                    const showChrome = isActive || field.isNew

                                    return (
                                        <Rnd
                                            key={`${field.id}-${scale}`}
                                            position={{
                                                x: field.x * scaledWidth,
                                                y: field.y * scaledHeight,
                                            }}
                                            size={{
                                                width: field.width * scale,
                                                height: field.height * scale,
                                            }}
                                            onDragStop={(e, d) => {
                                                onFieldPositionUpdate(field.id, { x: d.x, y: d.y })
                                            }}
                                            onResizeStop={(e, direction, ref, delta, position) => {
                                                onFieldDimensionsUpdate(field.id, {
                                                    width: parseInt(ref.style.width) / scale,
                                                    height: parseInt(ref.style.height) / scale,
                                                })
                                                onFieldPositionUpdate(field.id, position)
                                            }}
                                            bounds="parent"
                                            dragHandleClassName="drag-handle"
                                            enableResizing={showChrome}
                                            disableDragging={!showChrome}
                                            className={cn(
                                                'pointer-events-auto !border-none !outline-none',
                                                showChrome && '!cursor-auto'
                                            )}
                                            style={{ border: 'none' }}
                                        >
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onFieldClick(field.id)
                                                }}
                                                className={cn(
                                                    'flex h-full w-full items-center gap-1 rounded p-1 transition-colors',
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
                                                    className="h-full flex-1 border-0 bg-transparent p-0 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none outline-none"
                                                    placeholder="Type here..."
                                                    style={{
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
                                        </Rnd>
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
                                    const isActive = activeFieldId === field.id
                                    const showChrome = isActive || field.isNew

                                    return (
                                        <Rnd
                                            key={`${field.id}-${scale}`}
                                            position={{
                                                x: field.x * scaledWidth,
                                                y: field.y * scaledHeight,
                                            }}
                                            size={{
                                                width: field.width * scale,
                                                height: field.height * scale,
                                            }}
                                            onDragStop={(_e, d) => {
                                                onSignaturePositionUpdate(field.id, { x: d.x, y: d.y })
                                            }}
                                            onResizeStop={(_e, _direction, ref, _delta, position) => {
                                                onSignatureDimensionsUpdate(field.id, {
                                                    width: parseInt(ref.style.width) / scale,
                                                    height: parseInt(ref.style.height) / scale,
                                                })
                                                onSignaturePositionUpdate(field.id, position)
                                            }}
                                            bounds="parent"
                                            dragHandleClassName="drag-handle"
                                            enableResizing={showChrome}
                                            disableDragging={!showChrome}
                                            lockAspectRatio={true}
                                            className={cn(
                                                'pointer-events-auto',
                                                showChrome && '!cursor-auto'
                                            )}
                                        >
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onFieldClick(field.id)
                                                }}
                                                className={cn(
                                                    'relative h-full w-full rounded p-1 transition-colors',
                                                    showChrome
                                                        ? 'z-50 border border-sky-500 bg-white/10 shadow-sm ring-1 ring-sky-500'
                                                        : 'z-10 border border-transparent hover:border-slate-300 hover:bg-white/10'
                                                )}
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
                                        </Rnd>
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
