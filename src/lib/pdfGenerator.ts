import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { toast } from 'sonner'
import { TextField, SignatureField } from '@/types'
import { ARBITRARY_FIELD_X_OFFSET, ARBITRARY_FIELD_Y_OFFSET } from '@/lib/constants'

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const cdnFontUrlFor = (family: string, weight: string, style: string) =>
    `https://cdn.jsdelivr.net/npm/@fontsource/${family}/files/${family}-latin-${weight}-${style}.woff2`

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
        const cdnUrl = cdnFontUrlFor(family, weight, style)

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
        const url = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}` +
            `:ital,wght@${googleStyle},${googleWeight}&display=swap`

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

export const generateSignedPdf = async (
    pdfFile: string,
    fileName: string | null,
    textFields: TextField[],
    signatureFields: SignatureField[],
) => {
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

        // eslint-disable-next-line no-restricted-globals
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
