import React, { useState, useRef } from 'react'
import { PDFDocument } from 'pdf-lib'
import { Document, Page, pdfjs } from 'react-pdf'
import Draggable from 'react-draggable'
import { Upload, Download, Plus, FileText, MousePointer2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

type TextField = {
    id: string
    text: string
    x: number
    y: number
}

function App() {
    const [pdfFile, setPdfFile] = useState<string | null>(null)
    const [textFields, setTextFields] = useState<TextField[]>([])
    const [scale, setScale] = useState(1.0)
    const containerRef = useRef<HTMLDivElement>(null)
    const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 })

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setPdfFile(reader.result as string)
                toast.success('PDF uploaded successfully')
            }
            reader.readAsDataURL(file)
        }
    }

    const addTextField = () => {
        if (!pdfDimensions.width) return

        const newField: TextField = {
            id: Date.now().toString(),
            text: 'Click to edit',
            x: (pdfDimensions.width * scale) / 2 - 75,
            y: (pdfDimensions.height * scale) / 3
        }
        setTextFields([...textFields, newField])
        toast.info('Text field added')
    }

    const updateTextField = (id: string, newText: string) => {
        setTextFields(textFields.map(field =>
            field.id === id ? { ...field, text: newText } : field
        ))
    }

    const handleDragStop = (id: string, data: { x: number; y: number }) => {
        setTextFields(textFields.map(field =>
            field.id === id ? { ...field, x: data.x, y: data.y } : field
        ))
    }

    const downloadPDF = async () => {
        if (!pdfFile) return

        try {
            const existingPdfBytes = await fetch(pdfFile).then(res => res.arrayBuffer())
            const pdfDoc = await PDFDocument.load(existingPdfBytes)
            const page = pdfDoc.getPage(0)
            const { height } = page.getSize()
            const font = await pdfDoc.embedFont('Helvetica')

            textFields.forEach(field => {
                const pdfX = field.x / scale
                const pdfY = height - ((field.y / scale) + 20) // Approximate height offset

                page.drawText(field.text, {
                    x: pdfX,
                    y: pdfY,
                    font,
                    size: 10,
                })
            })

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'edited-document.pdf'
            link.click()
            toast.success('PDF downloaded successfully')
        } catch (error) {
            console.error(error)
            toast.error('Failed to download PDF')
        }
    }



    const handlePageLoadSuccess = (page: any) => {
        setPdfDimensions({
            width: page.originalWidth,
            height: page.originalHeight
        })
    }

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-neutral-200">
            <Toaster />

            {/* Header */}
            <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-neutral-900 text-white p-1.5 rounded-md">
                            <FileText size={20} />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Firma</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        {!pdfFile ? (
                            <div className="relative">
                                <Button variant="default" className="cursor-pointer relative overflow-hidden">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload PDF
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 mr-4 border-r border-neutral-200 pr-4">
                                    <span className="text-sm text-neutral-500">Zoom</span>
                                    <Slider
                                        defaultValue={[1]}
                                        max={2}
                                        min={0.5}
                                        step={0.1}
                                        value={[scale]}
                                        onValueChange={(value) => setScale(value[0])}
                                        className="w-32"
                                    />
                                    <span className="text-sm font-medium w-8 text-right">{Math.round(scale * 100)}%</span>
                                </div>
                                <Button variant="outline" onClick={addTextField}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Text
                                </Button>
                                <Button onClick={downloadPDF}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!pdfFile ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <div className="bg-white p-12 rounded-2xl shadow-sm border border-neutral-200 max-w-lg w-full">
                            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-400">
                                <Upload size={32} />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Upload your document</h2>
                            <p className="text-neutral-500 mb-8">
                                Drag and drop your PDF here, or click to browse.
                                <br />
                                Your files stay private and are processed locally.
                            </p>
                            <div className="relative inline-block">
                                <Button size="lg" className="w-full sm:w-auto cursor-pointer">
                                    Choose File
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <Card className="border-neutral-200 shadow-sm overflow-hidden bg-neutral-100/50">
                            <CardContent className="p-0">
                                <div
                                    ref={containerRef}
                                    className="relative overflow-auto max-h-[calc(100vh-12rem)] p-8 flex justify-center"
                                >
                                    <Document
                                        file={pdfFile}
                                        className="shadow-xl"
                                    >
                                        <div className="relative">
                                            <Page
                                                pageNumber={1}
                                                scale={scale}
                                                onLoadSuccess={handlePageLoadSuccess}
                                                renderTextLayer={false}
                                                renderAnnotationLayer={false}
                                                className="bg-white"
                                            />
                                            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                                                {textFields.map(field => (
                                                    <Draggable
                                                        key={field.id}
                                                        defaultPosition={{ x: field.x, y: field.y }}
                                                        onStop={(e, data) => handleDragStop(field.id, data)}
                                                        bounds="parent"
                                                    >
                                                        <div className="absolute pointer-events-auto group">
                                                            <div className="relative">
                                                                <Input
                                                                    type="text"
                                                                    value={field.text}
                                                                    onChange={(e) => updateTextField(field.id, e.target.value)}
                                                                    className="h-8 py-1 px-2 min-w-[150px] bg-transparent border-transparent hover:border-blue-400 focus:border-blue-500 focus:bg-white/90 focus:ring-2 focus:ring-blue-200 transition-all shadow-none rounded"
                                                                    autoFocus
                                                                />
                                                                <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-move p-1 bg-white rounded-full shadow border border-neutral-200 text-neutral-400 hover:text-neutral-600">
                                                                    <MousePointer2 size={12} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Draggable>
                                                ))}
                                            </div>
                                        </div>
                                    </Document>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    )
}

export default App