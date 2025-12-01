import { useState, useRef, useEffect } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Signature } from '@/types'
import { Pen, Type, Upload, Trash2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSignaturesStore } from '@/store/signatures'

interface SignatureManagerProps {
    onPlaceSignature: (id: string) => void
}

export function SignatureManager({
    onPlaceSignature,
}: SignatureManagerProps) {
    const { signatures, addSignature, removeSignature } = useSignaturesStore()
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('draw')
    const [typedName, setTypedName] = useState('')
    const canvasRef = useRef<HTMLCanvasElement>(null)
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
        const canvas = canvasRef.current
        if (!canvas) return
        const dataUrl = canvas.toDataURL('image/png')
        addSignature({
            id: crypto.randomUUID(),
            dataUrl,
            type: 'draw',
            createdAt: Date.now(),
        })
        setIsOpen(false)
        clearCanvas()
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
            id: crypto.randomUUID(),
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
                id: crypto.randomUUID(),
                dataUrl: reader.result as string,
                type: 'upload',
                createdAt: Date.now(),
            })
            setIsOpen(false)
        }
        reader.readAsDataURL(file)
    }

    useEffect(() => {
        if (activeTab === 'draw' && isOpen) {
            // Initialize canvas context settings
            setTimeout(() => {
                const canvas = canvasRef.current
                if (canvas) {
                    const ctx = canvas.getContext('2d')
                    if (ctx) {
                        ctx.lineWidth = 2
                        ctx.lineCap = 'round'
                        ctx.strokeStyle = 'black'
                    }
                }
            }, 100)
        }
    }, [activeTab, isOpen])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Signatures</p>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger className={buttonVariants({ variant: "ghost", size: "icon-sm" })}>
                        <Plus className="size-4" />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Signature</DialogTitle>
                        </DialogHeader>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="draw">Draw</TabsTrigger>
                                <TabsTrigger value="type">Type</TabsTrigger>
                                <TabsTrigger value="upload">Upload</TabsTrigger>
                            </TabsList>
                            <TabsContent value="draw" className="space-y-4 py-4">
                                <div className="rounded-md border border-slate-200 bg-white p-1">
                                    <canvas
                                        ref={canvasRef}
                                        width={400}
                                        height={200}
                                        className="w-full cursor-crosshair touch-none rounded bg-white"
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseLeave={stopDrawing}
                                        onTouchStart={startDrawing}
                                        onTouchMove={draw}
                                        onTouchEnd={stopDrawing}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <Button variant="outline" size="sm" onClick={clearCanvas}>Clear</Button>
                                    <Button size="sm" onClick={saveDrawing}>Create Signature</Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="type" className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Your Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={typedName}
                                        onChange={(e) => setTypedName(e.target.value)}
                                    />
                                </div>
                                <div className="flex h-32 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
                                    <p className="text-4xl" style={{ fontFamily: '"Dancing Script", cursive' }}>
                                        {typedName || 'Preview'}
                                    </p>
                                </div>
                                <Button className="w-full" onClick={saveTyped} disabled={!typedName}>Create Signature</Button>
                            </TabsContent>
                            <TabsContent value="upload" className="space-y-4 py-4">
                                <div className="flex h-40 w-full items-center justify-center rounded-md border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100">
                                    <Label htmlFor="signature-upload" className="flex cursor-pointer flex-col items-center gap-2">
                                        <Upload className="size-8 text-slate-400" />
                                        <span className="text-sm text-slate-500">Click to upload image</span>
                                        <Input
                                            id="signature-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleUpload}
                                        />
                                    </Label>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-2">
                {signatures.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500">
                        No signatures yet
                    </div>
                ) : (
                    signatures.map(signature => (
                        <div
                            key={signature.id}
                            className="group relative flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white p-2 transition-all hover:border-sky-500 hover:shadow-sm"
                            onClick={() => onPlaceSignature(signature.id)}
                        >
                            <img src={signature.dataUrl} alt="Signature" className="h-8 max-w-full object-contain" />
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    removeSignature(signature.id)
                                }}
                            >
                                <Trash2 className="size-3 text-red-500" />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
