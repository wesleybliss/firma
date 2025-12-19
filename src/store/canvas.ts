import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import {
    TextField, SignatureField, FieldType,
} from '@/types'
import { usePdfStore } from '@/store/pdf'
import { useUserStore } from '@/store/user'
import { useSignaturesStore } from '@/store/signatures'
import { useDefaultsStore } from '@/store/defaults'
import { formatDate } from '@/lib/dateUtils'

// Helper for clamping values
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

interface CanvasState {
    textFields: TextField[]
    signatureFields: SignatureField[]
    activeFieldId: string | null
}

interface CanvasActions {
    // Actions
    setTextFields: (fields: TextField[]) => void
    setSignatureFields: (fields: SignatureField[]) => void
    setActiveFieldId: (id: string | null) => void

    addTextField: (fieldType?: FieldType) => void
    removeTextField: (id: string) => void
    updateTextField: (id: string, text: string) => void
    updateFieldProperty: (id: string, property: keyof TextField, value: any) => void
    updateFieldPosition: (id: string, position: { x: number; y: number }) => void
    updateFieldDimensions: (id: string, dimensions: { width: number; height: number }) => void

    placeSignature: (signatureId: string) => void
    removeSignatureField: (id: string) => void
    updateSignaturePosition: (id: string, position: { x: number; y: number }) => void
    updateSignatureDimensions: (id: string, dimensions: { width: number; height: number }) => void

    resetCanvas: () => void
    deselectAll: () => void
}

const initialState: CanvasState = {
    textFields: [],
    signatureFields: [],
    activeFieldId: null,
}

// Helper to get defaults based on field type and current store state
const getFieldDefaults = (fieldType: FieldType) => {
    const user = useUserStore.getState()
    const { dateFormat, fontSize, fontFamily } = useDefaultsStore.getState()

    switch (fieldType) {
        case 'date': {
            const today = new Date()
            const formatted = formatDate(today, dateFormat)
            return { text: formatted, width: 140, height: 40, fontSize, fontFamily }
        }
        case 'fullName':
            return { text: user.name || 'Full Name', width: 200, height: 40, fontSize, fontFamily }
        case 'initials':
            return { text: user.initials || 'AB', width: 60, height: 40, fontSize, fontFamily }
        case 'email':
            return { text: user.email || 'email@example.com', width: 220, height: 40, fontSize, fontFamily }
        case 'phone':
            return { text: user.phone || '(555) 000-0000', width: 160, height: 40, fontSize, fontFamily }
        case 'company':
            return { text: user.company || 'Company Name', width: 200, height: 40, fontSize, fontFamily }
        case 'address':
            return { text: user.address || 'Address', width: 250, height: 60, fontSize, fontFamily }
        case 'address2':
            return { text: user.address2 || 'Address 2', width: 250, height: 60, fontSize, fontFamily }
        case 'checkbox':
            return { text: '✓', width: 14, height: 24, fontSize: 16, fontFamily }
        case 'radio':
            return { text: '⏺', width: 24, height: 24, fontSize: 16, fontFamily }
        case 'x':
            return { text: '✕', width: 24, height: 24, fontSize: 16, fontFamily }
        case 'text':
        default:
            return { text: 'New text', width: 120, height: 40, fontSize, fontFamily }
    }
}

export const useCanvasStore = create<CanvasState & CanvasActions>(set => ({
    ...initialState,

    setTextFields: textFields => set({ textFields }),
    setSignatureFields: signatureFields => set({ signatureFields }),
    setActiveFieldId: activeFieldId => set({ activeFieldId }),
    resetCanvas: () => set(initialState),

    addTextField: (fieldType = 'text') => {
        const { pdfDimensions, currentPage } = usePdfStore.getState()

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
            fontFamily: defaults.fontFamily,
            fontSize: defaults.fontSize,
            color: '#000000',
            isBold: false,
            isItalic: false,
            isUnderline: false,
            isStrikethrough: false,
            page: currentPage,
            fieldType,
        }

        set(state => ({
            textFields: [...state.textFields, newField],
            activeFieldId: newField.id,
        }))

        const fieldTypeLabel = fieldType === 'text'
            ? 'Text field'
            : `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} field`
        toast.info(`${fieldTypeLabel} added to the canvas`)
    },

    removeTextField: id => {
        set(state => ({
            textFields: state.textFields.filter(field => field.id !== id),
            activeFieldId: state.activeFieldId === id ? null : state.activeFieldId,
        }))
    },

    updateTextField: (id, text) => {
        set(state => ({
            textFields: state.textFields.map(field =>
                field.id === id ? { ...field, text, isNew: false } : field,
            ),
        }))
    },

    updateFieldProperty: (id, property, value) => {
        set(state => ({
            textFields: state.textFields.map(field =>
                field.id === id ? { ...field, [property]: value, isNew: false } : field,
            ),
        }))
    },

    updateFieldPosition: (id, position) => {
        const { pdfDimensions, scale } = usePdfStore.getState()
        if (!pdfDimensions.width || !pdfDimensions.height) return

        const width = pdfDimensions.width * scale
        const height = pdfDimensions.height * scale

        set(state => ({
            textFields: state.textFields.map(field =>
                field.id === id
                    ? {
                        ...field,
                        x: clamp(position.x / width, 0, 1),
                        y: clamp(position.y / height, 0, 1),
                        isNew: false,
                    }
                    : field,
            ),
        }))
    },

    updateFieldDimensions: (id, dimensions) => {
        set(state => ({
            textFields: state.textFields.map(field =>
                field.id === id
                    ? {
                        ...field,
                        width: dimensions.width,
                        height: dimensions.height,
                        isNew: false,
                    }
                    : field,
            ),
        }))
    },

    placeSignature: signatureId => {
        const { pdfDimensions, currentPage } = usePdfStore.getState()
        const { signatures } = useSignaturesStore.getState()

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

        // Adjust height based on aspect ratio
        const img = new Image()
        img.onload = () => {
            const aspectRatio = img.width / img.height
            const adjustedHeight = 150 / aspectRatio

            set(state => ({
                signatureFields: state.signatureFields.map(f =>
                    f.id === newField.id ? { ...f, height: adjustedHeight } : f,
                ),
            }))
        }
        img.src = signature.dataUrl

        set(state => ({
            signatureFields: [...state.signatureFields, newField],
            activeFieldId: newField.id,
        }))
        toast.info('Signature added to canvas')
    },

    removeSignatureField: id => {
        set(state => ({
            signatureFields: state.signatureFields.filter(f => f.id !== id),
            activeFieldId: state.activeFieldId === id ? null : state.activeFieldId,
        }))
    },

    updateSignaturePosition: (id, position) => {
        const { pdfDimensions, scale } = usePdfStore.getState()
        if (!pdfDimensions.width || !pdfDimensions.height) return

        const width = pdfDimensions.width * scale
        const height = pdfDimensions.height * scale

        set(state => ({
            signatureFields: state.signatureFields.map(field =>
                field.id === id
                    ? {
                        ...field,
                        x: clamp(position.x / width, 0, 1),
                        y: clamp(position.y / height, 0, 1),
                        isNew: false,
                    }
                    : field,
            ),
        }))
    },

    updateSignatureDimensions: (id, dimensions) => {
        set(state => ({
            signatureFields: state.signatureFields.map(field =>
                field.id === id
                    ? {
                        ...field,
                        width: dimensions.width,
                        height: dimensions.height,
                        isNew: false,
                    }
                    : field,
            ),
        }))
    },

    deselectAll: () => {
        set(state => ({
            activeFieldId: null,
            textFields: state.textFields.map(f => ({ ...f, isNew: false })),
            signatureFields: state.signatureFields.map(f => ({ ...f, isNew: false })),
        }))
    },
}))
