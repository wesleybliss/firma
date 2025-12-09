import { useState, useRef, useEffect, useCallback, createRef, type ChangeEvent, type MouseEvent, type RefObject } from 'react'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { TextField, SignatureField, FieldType } from '@/types'
import { GOOGLE_FONTS } from '@/lib/fonts'
import { useSignaturesStore } from '@/store/signatures'
import { useUserStore } from '@/store/user'
import { useDefaultsStore } from '@/store/defaults'
import { formatDate } from '@/lib/dateUtils'
import { ZOOM_MAX, ARBITRARY_FIELD_X_OFFSET, ARBITRARY_FIELD_Y_OFFSET } from '@/lib/constants'
import { hashFile } from '@/lib/utils'
import { useDocumentsStore } from '@/store/documents'

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export function useFirma() {
    const [pdfFile, setPdfFile] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)
    const [textFields, setTextFields] = useState<TextField[]>([])
    const [signatureFields, setSignatureFields] = useState<SignatureField[]>([])
    const [activeFieldId, setActiveFieldId] = useState<string | null>(null)
    const [scale, setScale] = useState(ZOOM_MAX)
    const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 })
    const [numPages, setNumPages] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pdfHash, setPdfHash] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const nodeRefs = useRef<Record<string, RefObject<HTMLDivElement>>>({})

    const { signatures } = useSignaturesStore()
    const user = useUserStore()
    const { dateFormat } = useDefaultsStore()
    const { saveDocumentState, loadDocumentState } = useDocumentsStore()

    useEffect(() => {
        const links = GOOGLE_FONTS.map(font => {
            const link = document.createElement('link')
            link.href = font.url
            link.rel = 'stylesheet'
            document.head.appendChild(link)
            return link
        })

        return () => {
            links.forEach(link => {
                if (link.parentNode) {
                    document.head.removeChild(link)
                }
            })
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

    useEffect(() => {
        if (!pdfHash || !fileName) return

        const timeoutId = setTimeout(() => {
            saveDocumentState(pdfHash, {
                hash: pdfHash,
                textFields,
                signatureFields,
                lastModified: Date.now(),
                fileName
            })
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [textFields, signatureFields, pdfHash, fileName, saveDocumentState])

    const openFileDialog = () => {
        fileInputRef.current?.click()
    }

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            const hash = await hashFile(file)
            setPdfHash(hash)

            const savedState = await loadDocumentState(hash)

            const reader = new FileReader()
            reader.onloadend = () => {
                setPdfFile(reader.result as string)
                setFileName(file.name)

                if (savedState) {
                    setTextFields(savedState.textFields)
                    setSignatureFields(savedState.signatureFields)
                    toast.success('Restored previous session')
                } else {
                    setTextFields([])
                    setSignatureFields([])
                    toast.success('PDF is ready to edit')
                }

                setActiveFieldId(null)
                setScale(ZOOM_MAX)
            }
            reader.readAsDataURL(file)
        } catch (error) {
            console.error('Error processing file:', error)
            toast.error('Error opening file')
        }

        event.target.value = ''
    }

    const getNodeRef = (id: string) => {
        if (!nodeRefs.current[id]) {
            nodeRefs.current[id] = createRef<HTMLDivElement>()
        }
        return nodeRefs.current[id]
    }

    const getFieldDefaults = (fieldType: FieldType) => {
        switch (fieldType) {
            case 'date': {
                const today = new Date()
                const formatted = formatDate(today, dateFormat)
                return { text: formatted, width: 140, height: 40, fontSize: 12 }
            }
            case 'fullName':
                return { text: user.name || 'Full Name', width: 200, height: 40, fontSize: 12 }
            case 'initials':
                return { text: user.initials || 'AB', width: 60, height: 40, fontSize: 12 }
            case 'email':
                return { text: user.email || 'email@example.com', width: 220, height: 40, fontSize: 12 }
            case 'phone':
                return { text: user.phone || '(555) 000-0000', width: 160, height: 40, fontSize: 12 }
            case 'company':
                return { text: user.company || 'Company Name', width: 200, height: 40, fontSize: 12 }
            case 'checkbox':
                return { text: '✓', width: 14, height: 24, fontSize: 16 }
            case 'radio':
                return { text: '⏺', width: 24, height: 24, fontSize: 16 }
            case 'x':
                return { text: '✕', width: 24, height: 24, fontSize: 16 }
            case 'text':
            default:
                return { text: 'New text', width: 120, height: 40, fontSize: 16 }
        }
    }

    const addTextField = (fieldType: FieldType = 'text') => {
        if (!pdfDimensions.width || !pdfDimensions.height) {
            toast.error('Choose a PDF before adding text')
            return
        }

        const defaults = getFieldDefaults(fieldType)
        const newField: TextField = {
            id: uuidv4(),
            text: defaults.text,
            x: 0.5,
            y: 0.35,
            width: defaults.width,
            height: defaults.height,
            isNew: true,
            fontFamily: 'Inter',
            fontSize: defaults.fontSize,
            color: '#000000',
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikethrough: false,
            page: currentPage,
            fieldType,
        }

        setTextFields(previous => [...previous, newField])
        setActiveFieldId(newField.id)

        const fieldTypeLabel = fieldType === 'text' ? 'Text field' : `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} field`
        toast.info(`${fieldTypeLabel} added to the canvas`)
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

    const updateFieldDimensions = (id: string, dimensions: { width: number; height: number }) => {
        setTextFields(previous =>
            previous.map(field =>
                field.id === id
                    ? {
                        ...field,
                        width: dimensions.width,
                        height: dimensions.height,
                        isNew: false,
                    }
                    : field
            )
        )
    }

    const placeSignature = (signatureId: string) => {
        if (!pdfDimensions.width || !pdfDimensions.height) {
            toast.error('Choose a PDF before adding a signature')
            return
        }

        const signature = signatures.find(s => s.id === signatureId)
        if (!signature) return

        const newField: SignatureField = {
            id: uuidv4(),
            signatureId,
            dataUrl: signature.dataUrl,
            x: 0.5,
            y: 0.35,
            width: 150,
            height: 75,
            page: currentPage,
            isNew: true,
        }

        const img = new Image()
        img.onload = () => {
            const aspectRatio = img.width / img.height
            const adjustedHeight = 150 / aspectRatio

            setSignatureFields(prev => prev.map(f =>
                f.id === newField.id ? { ...f, height: adjustedHeight } : f
            ))
        }
        img.src = signature.dataUrl

        setSignatureFields(prev => [...prev, newField])
        setActiveFieldId(newField.id)
        toast.info('Signature added to canvas')
    }

    const removeSignatureField = (id: string) => {
        setSignatureFields(prev => prev.filter(f => f.id !== id))
        delete nodeRefs.current[id]
        if (activeFieldId === id) {
            setActiveFieldId(null)
        }
    }

    const updateSignaturePosition = (id: string, position: { x: number; y: number }) => {
        if (!pdfDimensions.width || !pdfDimensions.height) return

        const width = pdfDimensions.width * scale
        const height = pdfDimensions.height * scale

        setSignatureFields(prev =>
            prev.map(field =>
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

    const updateSignatureDimensions = (id: string, dimensions: { width: number; height: number }) => {
        setSignatureFields(prev =>
            prev.map(field =>
                field.id === id
                    ? {
                        ...field,
                        width: dimensions.width,
                        height: dimensions.height,
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
            // Special handling for Inter to use official rsms.me distribution (fixes PDF spacing issues)
            if (fontFamily === 'Inter') {
                let filename = 'Inter-Regular.woff2'
                if (isBold && isItalic) filename = 'Inter-BoldItalic.woff2'
                else if (isBold) filename = 'Inter-Bold.woff2'
                else if (isItalic) filename = 'Inter-Italic.woff2'

                try {
                    const response = await fetch(`https://rsms.me/inter/font-files/${filename}?v=3.19`)
                    if (response.ok) {
                        return await response.arrayBuffer()
                    }
                } catch (e) {
                    console.warn('rsms.me font fetch failed, falling back', e)
                }
            }

            // Try fetching from jsDelivr (static fonts) first to avoid Variable Font issues with pdf-lib
            const family = fontFamily.toLowerCase().replace(/ /g, '-')
            const weight = isBold ? '700' : '400'
            const style = isItalic ? 'italic' : 'normal'
            const cdnUrl = `https://cdn.jsdelivr.net/npm/@fontsource/${family}/files/${family}-latin-${weight}-${style}.woff2`

            try {
                const response = await fetch(cdnUrl)
                if (response.ok) {
                    return await response.arrayBuffer()
                }
            } catch (e) {
                console.warn('CDN font fetch failed, falling back to Google Fonts', e)
            }

            // Fallback to Google Fonts API
            const googleWeight = isBold ? '700' : '400'
            const googleStyle = isItalic ? '1' : '0'
            const url = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:ital,wght@${googleStyle},${googleWeight}&display=swap`

            const css = await fetch(url).then(res => res.text())

            // Try to find latin subset first
            const latinMatch = css.match(/\/\* latin \*\/[\s\S]*?src: url\((.+?)\) format\(['"]woff2['"]\)/)

            if (latinMatch) {
                return await fetch(latinMatch[1]).then(res => res.arrayBuffer())
            }

            // Fallback to any woff2
            const match = css.match(/src: url\((.+?)\) format\(['"]woff2['"]\)/)

            if (match) {
                return await fetch(match[1]).then(res => res.arrayBuffer())
            }

            // Fallback to truetype if woff2 missing
            const ttfMatch = css.match(/src: url\((.+?)\) format\(['"]truetype['"]\)/)
            if (ttfMatch) {
                return await fetch(ttfMatch[1]).then(res => res.arrayBuffer())
            }

            console.warn(`Could not parse font URL for ${fontFamily} ${style},${weight}`)
            return null
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

            // Group signatures by page
            const signaturesByPage: Record<number, SignatureField[]> = {}
            signatureFields.forEach(field => {
                if (!signaturesByPage[field.page]) {
                    signaturesByPage[field.page] = []
                }
                signaturesByPage[field.page].push(field)
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

                    const pdfX = clamp(field.x, 0, 1) * width + ARBITRARY_FIELD_X_OFFSET
                    const pdfY = height - clamp(field.y, 0, 1) * height - fontSize - ARBITRARY_FIELD_Y_OFFSET

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

            for (const [pageIndex, fields] of Object.entries(signaturesByPage)) {
                const page = pages[Number(pageIndex) - 1]
                if (!page) continue

                for (const field of fields) {
                    const imageBytes = await fetch(field.dataUrl).then(res => res.arrayBuffer())
                    let image
                    if (field.dataUrl.startsWith('data:image/png')) {
                        image = await pdfDoc.embedPng(imageBytes)
                    } else {
                        image = await pdfDoc.embedJpg(imageBytes)
                    }

                    const pdfX = clamp(field.x, 0, 1) * width
                    const pdfY = height - clamp(field.y, 0, 1) * height - field.height

                    page.drawImage(image, {
                        x: pdfX,
                        y: pdfY,
                        width: field.width,
                        height: field.height,
                    })
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
            setSignatureFields(previous => previous.map(field => ({ ...field, isNew: false })))
        }
    }

    return {
        state: {
            pdfFile,
            fileName,
            textFields,
            signatures,
            signatureFields,
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
            placeSignature,
            removeSignatureField,
            updateSignaturePosition,
            updateSignatureDimensions,
            updateFieldProperty,
            updateFieldPosition,
            updateFieldDimensions,
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
