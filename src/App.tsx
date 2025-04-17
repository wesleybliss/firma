import React, { useState, useRef } from 'react'
import { PDFDocument, rgb } from 'pdf-lib'
import { Document, Page, pdfjs } from 'react-pdf'
import Draggable from 'react-draggable'
import { Upload, Download } from 'lucide-react'
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
    const [numPages, setNumPages] = useState<number>(0)
    const [textFields, setTextFields] = useState<TextField[]>([])
    const [scale, setScale] = useState(1.5)
    const containerRef = useRef<HTMLDivElement>(null)
    const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 })

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setPdfFile(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const addTextField = () => {
        // Position the new field in the center of the visible PDF area
        const newField: TextField = {
            id: Date.now().toString(),
            text: 'Click to edit',
            x: (pdfDimensions.width * scale) / 2 - 75, // Center horizontally
            y: (pdfDimensions.height * scale) / 3      // Position in the upper third
        }
        setTextFields([...textFields, newField])
    }

    const updateTextField = (id: string, newText: string) => {
        setTextFields(textFields.map(field => 
            field.id === id ? { ...field, text: newText } : field
        ))
    }

    const handleDragStop = (id: string, e: any, data: { x: number; y: number }) => {
        setTextFields(textFields.map(field =>
            field.id === id ? { ...field, x: data.x, y: data.y } : field
        ))
    }

    const downloadPDF = async () => {
        if (!pdfFile) return

        const existingPdfBytes = await fetch(pdfFile).then(res => res.arrayBuffer())
        const pdfDoc = await PDFDocument.load(existingPdfBytes)
        const form = pdfDoc.getForm()
        const page = pdfDoc.getPage(0)
        const { height } = page.getSize()
        const font = await pdfDoc.embedFont('Helvetica')

        textFields.forEach(field => {
            // Convert coordinates to PDF coordinate system
            const pdfX = field.x / scale
            const pdfY = height - ((field.y / scale) + 20) // Add field height offset
            
            /*const textField = form.createTextField(`field-${field.id}`)
            textField.setText(field.text)
            textField.disableRichFormatting()
            
            textField.addToPage(page, {
                x: pdfX,
                y: pdfY,
                width: 150,
                height: 20,
                borderWidth: 0,
                borderColor: undefined,
                backgroundColor: rgb(1, 1, 1),
                font,
                fontSize: 12
            })*/
            page.drawText(field.text, {
                x: pdfX,
                y: pdfY,
                font,
                fontSize: 10,
                // No background or border properties needed
            })
        })

        const pdfBytes = await pdfDoc.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'document-with-fields.pdf'
        link.click()
    }

    const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages)
    }

    const handlePageLoadSuccess = (page: any) => {
        setPdfDimensions({
            width: page.originalWidth,
            height: page.originalHeight
        })
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">PDF Editor</h1>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                                <Upload size={20} />
                                Upload PDF
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </label>
                            {pdfFile && (
                                <>
                                    <button
                                        onClick={addTextField}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        Add Text Field
                                    </button>
                                    <button
                                        onClick={downloadPDF}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                    >
                                        <Download size={20} />
                                        Download
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div ref={containerRef} className="relative border border-gray-200 rounded-lg overflow-auto">
                        {pdfFile ? (
                            <Document
                                file={pdfFile}
                                onLoadSuccess={handleLoadSuccess}
                                className="mx-auto"
                            >
                                <div className="relative">
                                    <Page
                                        pageNumber={1}
                                        scale={scale}
                                        className="mx-auto"
                                        onLoadSuccess={handlePageLoadSuccess}
                                    />
                                    <div className="absolute inset-0" style={{ zIndex: 10 }}>
                                        {textFields.map(field => (
                                            <Draggable
                                                key={field.id}
                                                defaultPosition={{ x: field.x, y: field.y }}
                                                onStop={(e, data) => handleDragStop(field.id, e, data)}
                                                bounds="parent"
                                            >
                                                <div className="absolute cursor-move">
                                                    <input
                                                        type="text"
                                                        value={field.text}
                                                        onChange={(e) => updateTextField(field.id, e.target.value)}
                                                        className="px-2 py-1 border border-blue-400 rounded bg-white focus:outline-none focus:border-blue-600"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                            </Draggable>
                                        ))}
                                    </div>
                                </div>
                            </Document>
                        ) : (
                            <div className="flex items-center justify-center h-96 text-gray-500">
                                Upload a PDF to get started
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App