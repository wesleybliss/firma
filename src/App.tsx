import React, { useEffect, useRef, useState } from 'react'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { Document, Page, pdfjs } from 'react-pdf'
import Draggable from 'react-draggable'
import {
    Download,
    FileText,
    MousePointer2,
    PanelsTopLeft,
    Plus,
    Sparkles,
    Trash2,
    Type,
    UploadCloud,
    ZoomIn,
    ZoomOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

import 'react-pdf/dist/Page/TextLayer.css'

type TextField = {
    id: string
    text: string
    x: number
    y: number
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

function App() {
    const [pdfFile, setPdfFile] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)
    const [textFields, setTextFields] = useState<TextField[]>([])
    const [activeFieldId, setActiveFieldId] = useState<string | null>(null)
    const [scale, setScale] = useState(1)
    const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 })
    const fileInputRef = useRef<HTMLInputElement>(null)
    const nodeRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({})

    useEffect(() => {
        if (activeFieldId) {
            const input = document.getElementById(`field-${activeFieldId}`) as HTMLInputElement | null
            if (input) {
                input.focus()
                input.select()
            }
        }
    }, [activeFieldId])

    const openFileDialog = () => {
        fileInputRef.current?.click()
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            setPdfFile(reader.result as string)
            setFileName(file.name)
            setTextFields([])
            setActiveFieldId(null)
            setScale(1)
            toast.success('PDF is ready to edit')
        }
        reader.readAsDataURL(file)
        event.target.value = ''
    }

    const getNodeRef = (id: string) => {
        if (!nodeRefs.current[id]) {
            nodeRefs.current[id] = React.createRef<HTMLDivElement>()
        }
        return nodeRefs.current[id]
    }

    const addTextField = () => {
        if (!pdfDimensions.width || !pdfDimensions.height) {
            toast.error('Upload a PDF before adding text')
            return
        }

        const newField: TextField = {
            id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now().toString(),
            text: 'New text',
            x: 0.5,
            y: 0.35,
        }

        setTextFields(previous => [...previous, newField])
        setActiveFieldId(newField.id)
        toast.info('Text field added to the canvas')
    }

    const removeTextField = (id: string) => {
        setTextFields(previous => previous.filter(field => field.id !== id))
        delete nodeRefs.current[id]
        if (activeFieldId === id) {
            setActiveFieldId(null)
        }
    }

    const updateTextField = (id: string, text: string) => {
        setTextFields(previous =>
            previous.map(field => (field.id === id ? { ...field, text } : field))
        )
    }

    const updateFieldPosition = (id: string, position: { x: number; y: number }) => {
        if (!pdfDimensions.width || !pdfDimensions.height) return

        const width = pdfDimensions.width * scale
        const height = pdfDimensions.height * scale

        setTextFields(previous =>
            previous.map(field =>
                field.id === id
                    ? {
                          ...field,
                          x: clamp(position.x / width, 0, 1),
                          y: clamp(position.y / height, 0, 1),
                      }
                    : field
            )
        )
    }

    const handleDownload = async () => {
        if (!pdfFile) return

        try {
            const existingPdfBytes = await fetch(pdfFile).then(res => res.arrayBuffer())
            const pdfDoc = await PDFDocument.load(existingPdfBytes)
            const page = pdfDoc.getPage(0)
            const { width, height } = page.getSize()
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
            const fontSize = 12

            textFields.forEach(field => {
                if (!field.text.trim()) return

                const pdfX = clamp(field.x, 0, 1) * width
                const pdfY = height - clamp(field.y, 0, 1) * height - fontSize

                page.drawText(field.text, {
                    x: pdfX,
                    y: pdfY,
                    size: fontSize,
                    font,
                })
            })

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = fileName ? `firma-${fileName}` : 'firma-document.pdf'
            link.click()
            URL.revokeObjectURL(url)
            toast.success('PDF downloaded')
        } catch (error) {
            console.error(error)
            toast.error('Something went wrong while creating your PDF')
        }
    }

    const handlePageLoadSuccess = (page: any) => {
        setPdfDimensions({
            width: page.originalWidth,
            height: page.originalHeight,
        })
    }

    const handleZoomChange = (value: number[]) => {
        const next = clamp(value[0], 0.5, 2)
        setScale(Number(next.toFixed(2)))
    }

    const adjustZoom = (step: number) => {
        setScale(previous => {
            const next = clamp(previous + step, 0.5, 2)
            return Number(next.toFixed(2))
        })
    }

    const resetZoom = () => setScale(1)

    const scaledWidth = pdfDimensions.width * scale
    const scaledHeight = pdfDimensions.height * scale

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900">
            <Toaster richColors />
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
            />
            <div className="flex h-screen flex-col">
                <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
                    <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                                <FileText className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold tracking-tight text-slate-900">Firma</p>
                                <p className="text-xs text-slate-500">Fill, align, and export PDFs in seconds</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={openFileDialog}>
                                <UploadCloud className="size-4" />
                                {pdfFile ? 'Replace PDF' : 'Upload PDF'}
                            </Button>
                            <Button variant="outline" size="sm" onClick={addTextField} disabled={!pdfFile}>
                                <Type className="size-4" />
                                Add Text
                            </Button>
                            <Button size="sm" onClick={handleDownload} disabled={!pdfFile || textFields.length === 0}>
                                <Download className="size-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                </header>

                {pdfFile ? (
                    <div className="flex flex-1 overflow-hidden">
                        <aside className="hidden w-72 border-r border-slate-200 bg-white/70 px-6 py-6 md:flex md:flex-col md:gap-8">
                            <section>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Overview</p>
                                <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <Sparkles className="mt-1 size-4 text-slate-400" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{fileName ?? 'Untitled.pdf'}</p>
                                            <p className="text-xs text-slate-500">{textFields.length} field{textFields.length === 1 ? '' : 's'} on page 1</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={addTextField}>
                                        <Plus className="size-4" />
                                        Drop a new text field
                                    </Button>
                                </div>
                            </section>

                            <section>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">How it works</p>
                                <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
                                    <div className="flex gap-3">
                                        <UploadCloud className="size-4 text-slate-400" />
                                        <span>Upload your PDF from the toolbar above.</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <MousePointer2 className="size-4 text-slate-400" />
                                        <span>Drag any text field to the right spot.</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <Download className="size-4 text-slate-400" />
                                        <span>Export a flattened PDF when you’re done.</span>
                                    </div>
                                </div>
                            </section>
                        </aside>

                        <main className="flex-1 overflow-hidden px-4 py-6 sm:px-6">
                            <div className="mx-auto flex h-full max-w-5xl flex-col gap-6">
                                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg backdrop-blur md:flex-row md:items-center">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Canvas</p>
                                        <p className="text-xs text-slate-500">Drag to reposition text. Use the inspector to fine-tune content.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button variant="outline" size="icon-sm" onClick={() => adjustZoom(-0.1)} disabled={scale <= 0.5}>
                                            <ZoomOut className="size-4" />
                                        </Button>
                                        <Slider
                                            className="w-40"
                                            min={0.5}
                                            max={2}
                                            step={0.1}
                                            value={[scale]}
                                            onValueChange={handleZoomChange}
                                        />
                                        <Button variant="outline" size="icon-sm" onClick={() => adjustZoom(0.1)} disabled={scale >= 2}>
                                            <ZoomIn className="size-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={resetZoom} disabled={scale === 1}>
                                            Reset
                                        </Button>
                                        <span className="text-xs font-medium text-slate-500">{Math.round(scale * 100)}%</span>
                                    </div>
                                </div>

                                <div className="relative flex flex-1 items-center justify-center rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-2xl backdrop-blur">
                                    <div className="relative h-full w-full overflow-auto rounded-2xl border border-slate-200/60 bg-slate-50 p-6 shadow-inner">
                                        <div className="flex justify-center">
                                            <div
                                                className="relative inline-block"
                                                style={{
                                                    width: scaledWidth || undefined,
                                                    height: scaledHeight || undefined,
                                                }}
                                            >
                                                <Document
                                                    file={pdfFile}
                                                    className="drop-shadow-xl"
                                                    loading={
                                                        <div className="flex h-64 w-64 items-center justify-center text-sm text-slate-500">
                                                            Rendering PDF…
                                                        </div>
                                                    }
                                                >
                                                    <Page
                                                        pageNumber={1}
                                                        scale={scale}
                                                        onLoadSuccess={handlePageLoadSuccess}
                                                        renderTextLayer={false}
                                                        renderAnnotationLayer={false}
                                                    />
                                                </Document>

                                                {pdfDimensions.width > 0 && (
                                                    <div
                                                        className="pointer-events-none absolute left-0 top-0"
                                                        style={{
                                                            width: scaledWidth,
                                                            height: scaledHeight,
                                                        }}
                                                    >
                                                        {textFields.map(field => {
                                                            const nodeRef = getNodeRef(field.id)
                                                            const isActive = activeFieldId === field.id

                                                            return (
                                                                <Draggable
                                                                    key={field.id}
                                                                    nodeRef={nodeRef}
                                                                    position={{
                                                                        x: field.x * scaledWidth,
                                                                        y: field.y * scaledHeight,
                                                                    }}
                                                                    onDrag={(_, data) => updateFieldPosition(field.id, data)}
                                                                    onStop={(_, data) => updateFieldPosition(field.id, data)}
                                                                    bounds="parent"
                                                                >
                                                                    <div
                                                                        ref={nodeRef}
                                                                        className={cn(
                                                                            'pointer-events-auto rounded-lg border bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-sky-400',
                                                                            isActive ? 'border-sky-500 ring-2 ring-sky-400' : 'border-slate-200'
                                                                        )}
                                                                    >
                                                                        <Input
                                                                            id={`field-${field.id}`}
                                                                            value={field.text}
                                                                            onFocus={() => setActiveFieldId(field.id)}
                                                                            onClick={() => setActiveFieldId(field.id)}
                                                                            onChange={event => updateTextField(field.id, event.target.value)}
                                                                            className={cn('min-w-[180px] border-0 bg-transparent text-sm text-slate-900 focus-visible:ring-0')}
                                                                            placeholder="Enter text"
                                                                        />
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
                            </div>
                        </main>

                        <aside className="hidden w-80 flex-col border-l border-slate-200 bg-white/70 px-6 py-6 lg:flex">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Inspector</p>
                            <div className="mt-4 flex-1 space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                {textFields.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-slate-500">
                                        <PanelsTopLeft className="size-6 text-slate-300" />
                                        Add a text field to see it here.
                                    </div>
                                ) : (
                                    textFields.map((field, index) => {
                                        const isActive = activeFieldId === field.id
                                        return (
                                            <div
                                                key={field.id}
                                                className={cn(
                                                    'rounded-xl border p-4 transition-colors',
                                                    isActive ? 'border-sky-500 bg-sky-50/70' : 'border-slate-200 bg-white hover:border-slate-300'
                                                )}
                                            >
                                                <div className="mb-3 flex items-center justify-between">
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Field {index + 1}</p>
                                                    <Button variant="ghost" size="icon-sm" onClick={() => removeTextField(field.id)}>
                                                        <Trash2 className="size-4 text-slate-400" />
                                                    </Button>
                                                </div>
                                                <Input
                                                    value={field.text}
                                                    onChange={event => updateTextField(field.id, event.target.value)}
                                                    onFocus={() => setActiveFieldId(field.id)}
                                                    placeholder="Enter text"
                                                />
                                                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                                                    <span>X: {(field.x * 100).toFixed(0)}%</span>
                                                    <span>Y: {(field.y * 100).toFixed(0)}%</span>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </aside>
                    </div>
                ) : (
                    <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
                        <div className="relative w-full max-w-4xl space-y-12">
                            <div className="pointer-events-none absolute -inset-24 rounded-[3rem] bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.12),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.1),_transparent_60%)]" />
                            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-12 shadow-2xl backdrop-blur">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white">
                                    <UploadCloud className="size-7" />
                                </div>
                                <div className="mt-8 space-y-4 text-center">
                                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Drop in your PDF and start editing instantly</h1>
                                    <p className="text-base text-slate-500 sm:text-lg">
                                        Firma runs entirely in your browser. Place text anywhere, keep your data private, and export a polished document when you’re ready.
                                    </p>
                                </div>
                                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                                    <Button size="lg" onClick={openFileDialog}>
                                        <UploadCloud className="size-5" />
                                        Upload PDF
                                    </Button>
                                    <Button variant="outline" size="lg" onClick={addTextField} disabled>
                                        <Type className="size-5" />
                                        Add Text Field
                                    </Button>
                                </div>
                            </div>

                            <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <FeatureCard
                                    icon={<FileText className="size-5 text-slate-900" />}
                                    title="Precise placement"
                                    description="Drag fields with pixel-perfect control on a crisp PDF preview."
                                />
                                <FeatureCard
                                    icon={<MousePointer2 className="size-5 text-slate-900" />}
                                    title="Simple editing"
                                    description="Click any field to edit the text, size, or position instantly."
                                />
                                <FeatureCard
                                    icon={<Download className="size-5 text-slate-900" />}
                                    title="Private export"
                                    description="Everything happens locally. Download a flattened PDF in one click."
                                />
                            </div>
                        </div>
                    </main>
                )}
            </div>
        </div>
    )
}

type FeatureCardProps = {
    icon: React.ReactNode
    title: string
    description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
                {icon}
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
    )
}

export default App