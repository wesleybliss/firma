import { create } from 'zustand'
import { ZOOM_MAX } from '@/lib/constants'

interface PdfDimensions {
    width: number
    height: number
}

interface PdfState {
    pdfFile: string | null
    fileName: string | null
    pdfHash: string | null
    pdfDimensions: PdfDimensions
    numPages: number
    currentPage: number
    scale: number
}

interface PdfActions {
    setPdfFile: (pdfFile: string | null) => void
    setFileName: (fileName: string | null) => void
    setPdfHash: (hash: string | null) => void
    setPdfDimensions: (dimensions: PdfDimensions) => void
    setNumPages: (numPages: number) => void
    setCurrentPage: (page: number) => void
    setScale: (scale: number) => void
    resetPdf: () => void

    // Helper actions
    changePage: (offset: number) => void
    zoomIn: () => void
    zoomOut: () => void
    resetZoom: () => void
}

const initialState: PdfState = {
    pdfFile: null,
    fileName: null,
    pdfHash: null,
    pdfDimensions: { width: 0, height: 0 },
    numPages: 0,
    currentPage: 1,
    scale: ZOOM_MAX,
}

export const usePdfStore = create<PdfState & PdfActions>((set, get) => ({
    ...initialState,

    setPdfFile: pdfFile => set({ pdfFile }),
    setFileName: fileName => set({ fileName }),
    setPdfHash: pdfHash => set({ pdfHash }),
    setPdfDimensions: pdfDimensions => set({ pdfDimensions }),
    setNumPages: numPages => set({ numPages }),
    setCurrentPage: currentPage => set({ currentPage }),
    setScale: scale => set({ scale }),
    resetPdf: () => set(initialState),

    changePage: offset => {
        const { currentPage, numPages } = get()
        const newPage = Math.min(Math.max(currentPage + offset, 1), numPages)
        set({ currentPage: newPage })
    },

    zoomIn: () => {
        const { scale } = get()
        const newScale = Math.min(scale + 0.1, 2)
        set({ scale: Number(newScale.toFixed(2)) })
    },

    zoomOut: () => {
        const { scale } = get()
        const newScale = Math.max(scale - 0.1, 0.5)
        set({ scale: Number(newScale.toFixed(2)) })
    },

    resetZoom: () => set({ scale: 1 }),
}))
