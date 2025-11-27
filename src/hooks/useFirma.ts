import { useState, useRef, useEffect, useCallback, createRef, type ChangeEvent, type MouseEvent, type RefObject } from 'react'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { toast } from 'sonner'
import { TextField } from '@/types'
import { GOOGLE_FONTS } from '@/lib/fonts'

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export function useFirma() {
    const [pdfFile, setPdfFile] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)
    const [textFields, setTextFields] = useState<TextField[]>([])
    const [activeFieldId, setActiveFieldId] = useState<string | null>(null)
    const [scale, setScale] = useState(1)
    const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 })
    const [numPages, setNumPages] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const nodeRefs = useRef<Record<string, RefObject<HTMLDivElement>>>({})

    useEffect(() => {
        const link = document.createElement('link')
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Roboto:wght@400;700&family=Open+Sans:wght@400;700&family=Lato:wght@400;700&family=Montserrat:wght@400;700&family=Oswald:wght@400;700&family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;700&display=swap'
        link.rel = 'stylesheet'
        document.head.appendChild(link)
        return () => {
            document.head.removeChild(link)
        }
    }, [])

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

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
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
            nodeRefs.current[id] = createRef<HTMLDivElement>()
        }
        return nodeRefs.current[id]
    }

    const addTextField = () => {
        if (!pdfDimensions.width || !pdfDimensions.height) {
            toast.error('Choose a PDF before adding text')
            return
        }

        const newField: TextField = {
            id: crypto.randomUUID(),
            text: 'New text',
            x: 0.5,
            y: 0.35,
            isNew: true,
            fontFamily: 'Inter',
            fontSize: 16,
            color: '#000000',
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikethrough: false,
            page: currentPage,
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
            previous.map(field => (field.id === id ? { ...field, text, isNew: false } : field))
        )
    }

    const updateFieldProperty = (id: string, property: keyof TextField, value: any) => {
        setTextFields(previous =>
            previous.map(field => (field.id === id ? { ...field, [property]: value, isNew: false } : field))
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
                        isNew: false,
                    }
                    : field
            )
        )
    }

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result
            ? rgb(parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255)
            : rgb(0, 0, 0)
    }

    const fetchFontBytes = async (fontFamily: string, isBold: boolean, isItalic: boolean) => {
        try {
            const weight = isBold ? '700' : '400'
            const style = isItalic ? '1' : '0'
            const url = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:ital,wght@${style},${weight}&display=swap`

            const css = await fetch(url).then(res => res.text())
            const match = css.match(/src: url\((.+?)\) format\('woff2'\)/)

            if (!match) {
                console.warn(`Could not parse font URL for ${fontFamily} ${style},${weight}`)
                return null
            }

            return await fetch(match[1]).then(res => res.arrayBuffer())
        } catch (e) {
            console.error('Error fetching font:', e)
            return null
        }
    }

    const handleDownload = async () => {
        if (!pdfFile) return

        try {
            const existingPdfBytes = await fetch(pdfFile).then(res => res.arrayBuffer())
            const pdfDoc = await PDFDocument.load(existingPdfBytes)
            pdfDoc.registerFontkit(fontkit)

            // Group fields by page
            const fieldsByPage: Record<number, TextField[]> = {}
            textFields.forEach(field => {
                if (!field.text.trim()) return
                if (!fieldsByPage[field.page]) {
                    fieldsByPage[field.page] = []
                }
                fieldsByPage[field.page].push(field)
            })

            const pages = pdfDoc.getPages()
            const { width, height } = pages[0].getSize()

            const fontCache: Record<string, any> = {}

            for (const [pageIndex, fields] of Object.entries(fieldsByPage)) {
                const page = pages[Number(pageIndex) - 1]
                if (!page) continue

                for (const field of fields) {
                    const fontKey = `${field.fontFamily}-${field.isBold}-${field.isItalic}`
                    let font = fontCache[fontKey]

                    if (!font) {
                        const fontBytes = await fetchFontBytes(field.fontFamily, field.isBold, field.isItalic)
                        if (fontBytes) {
                            font = await pdfDoc.embedFont(fontBytes)
                            fontCache[fontKey] = font
                        } else {
                            font = await pdfDoc.embedFont(StandardFonts.Helvetica)
                        }
                    }

                    const fontSize = field.fontSize
                    const color = hexToRgb(field.color)

                    const pdfX = clamp(field.x, 0, 1) * width
                    const pdfY = height - clamp(field.y, 0, 1) * height - fontSize

                    page.drawText(field.text, {
                        x: pdfX,
                        y: pdfY,
                        size: fontSize,
                        font,
                        color,
                    })

                    const textWidth = font.widthOfTextAtSize(field.text, fontSize)

                    if (field.isUnderline) {
                        page.drawLine({
                            start: { x: pdfX, y: pdfY - 2 },
                            end: { x: pdfX + textWidth, y: pdfY - 2 },
                            thickness: fontSize / 15,
                            color,
                        })
                    }

                    if (field.isStrikethrough) {
                        page.drawLine({
                            start: { x: pdfX, y: pdfY + fontSize / 3 },
                            end: { x: pdfX + textWidth, y: pdfY + fontSize / 3 },
                            thickness: fontSize / 15,
                            color,
                        })
                    }
                }
            }

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
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

    const onDocumentLoadSuccess = useCallback((pdf: any) => {
        setNumPages(pdf.numPages)
    }, [])

    const onPageLoadSuccess = useCallback((page: any) => {
        setPdfDimensions({
            width: page.originalWidth,
            height: page.originalHeight
        })
    }, [])

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

    const changePage = (offset: number) => {
        setCurrentPage(prev => clamp(prev + offset, 1, numPages))
    }

    const resetZoom = () => setScale(1)

    const handleCanvasClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.react-pdf__Page')) {
            setActiveFieldId(null)
            setTextFields(previous => previous.map(field => ({ ...field, isNew: false })))
        }
    }

    return {
        state: {
            pdfFile,
            fileName,
            textFields,
            activeFieldId,
            scale,
            pdfDimensions,
            numPages,
            currentPage,
            fileInputRef,
        },
        actions: {
            openFileDialog,
            handleFileUpload,
            addTextField,
            removeTextField,
            updateTextField,
            updateFieldProperty,
            updateFieldPosition,
            handleDownload,
            onDocumentLoadSuccess,
            onPageLoadSuccess,
            handleZoomChange,
            adjustZoom,
            changePage,
            resetZoom,
            handleCanvasClick,
            setActiveFieldId,
            getNodeRef,
        },
    }
}
