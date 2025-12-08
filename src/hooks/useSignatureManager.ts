import { useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useSignaturesStore } from '@/store/signatures'
import { toast } from 'sonner'

const useSignatureManager = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    const { signatures, addSignature, removeSignature } = useSignaturesStore()

    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('draw')
    const [typedName, setTypedName] = useState('')
    const [showAll, setShowAll] = useState(false)
    const [isDrawing, setIsDrawing] = useState(false)

    // Drawing logic
    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        setIsDrawing(true)
        const rect = canvas.getBoundingClientRect()
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left
        const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top
        ctx.beginPath()
        ctx.moveTo(x, y)
    }

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const rect = canvas.getBoundingClientRect()
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left
        const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top
        ctx.lineTo(x, y)
        ctx.stroke()
    }

    const stopDrawing = () => {
        setIsDrawing(false)
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    const saveDrawing = () => {
        try {
            const canvas = canvasRef.current
            if (!canvas) {
                toast.error('Failed to save signature: Canvas not found')
                return
            }
            const dataUrl = canvas.toDataURL('image/png')
            addSignature({
                id: uuidv4(),
                dataUrl,
                type: 'draw',
                createdAt: Date.now(),
            })
            setIsOpen(false)
            clearCanvas()
        } catch (e: any) {
            toast.error('Failed to save signature: ' + (e?.message || 'Unknown error'))
        }
    }

    const saveTyped = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 400
        canvas.height = 100
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.font = '48px "Dancing Script", cursive' // Fallback to cursive if not loaded
        ctx.fillStyle = 'black'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(typedName, canvas.width / 2, canvas.height / 2)

        const dataUrl = canvas.toDataURL('image/png')
        addSignature({
            id: uuidv4(),
            dataUrl,
            type: 'type',
            createdAt: Date.now(),
        })
        setIsOpen(false)
        setTypedName('')
    }

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            addSignature({
                id: uuidv4(),
                dataUrl: reader.result as string,
                type: 'upload',
                createdAt: Date.now(),
            })
            setIsOpen(false)
        }
        reader.readAsDataURL(file)
    }

    return {

        // Refs
        canvasRef,

        // State
        signatures,
        addSignature,
        removeSignature,
        isOpen,
        setIsOpen,
        activeTab,
        setActiveTab,
        typedName,
        setTypedName,
        showAll,
        setShowAll,
        isDrawing,
        setIsDrawing,

        // Methods
        startDrawing,
        draw,
        stopDrawing,
        clearCanvas,
        saveDrawing,
        saveTyped,
        handleUpload,

    }

}

export default useSignatureManager
