import { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Plus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSignaturesStore } from '@/store/signatures'
import StyledCanvas from './StyledCanvas'

export function AddSignatureDialog() {
    const { addSignature } = useSignaturesStore()

    // Signature Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
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
            id: uuidv4(),
            dataUrl,
            type: 'draw',
            createdAt: Date.now(),
        })
        setIsDialogOpen(false)
        clearCanvas()
    }

    const saveTyped = () => {
        // eslint-disable-next-line no-restricted-globals
        const canvas = document.createElement('canvas')
        canvas.width = 400
        canvas.height = 100
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.font = '48px "Dancing Script", cursive'
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
        setIsDialogOpen(false)
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
            setIsDialogOpen(false)
        }
        reader.readAsDataURL(file)
    }

    useEffect(() => {
        if (activeTab === 'draw' && isDialogOpen) {
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
    }, [activeTab, isDialogOpen])

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 size-4" />
                    Add Signature
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md dark:bg-slate-900 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="dark:text-slate-100">
                        Add Signature
                    </DialogTitle>
                </DialogHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 dark:bg-slate-800 dark:text-slate-400">
                        <TabsTrigger value="draw" className="dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-slate-100">Draw</TabsTrigger>
                        <TabsTrigger value="type" className="dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-slate-100">Type</TabsTrigger>
                        <TabsTrigger value="upload" className="dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-slate-100">Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value="draw" className="space-y-4 py-4">
                        <div className="rounded-md border border-slate-200 bg-white p-1 dark:border-slate-800">
                            <StyledCanvas
                                ref={canvasRef}
                                width={400}
                                height={200}
                                className="w-full cursor-crosshair touch-none rounded"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing} />
                        </div>
                        <div className="flex justify-between">
                            <Button variant="outline" size="sm" onClick={clearCanvas} className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Clear</Button>
                            <Button size="sm" onClick={saveDrawing}>Create Signature</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="type" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="signature-name" className="dark:text-slate-200">Your Name</Label>
                            <Input
                                id="signature-name"
                                placeholder="John Doe"
                                value={typedName}
                                onChange={(e) => setTypedName(e.target.value)}
                                className="dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500" />
                        </div>
                        <div className="flex h-32 items-center justify-center rounded-md border border-slate-200 bg-slate-50 dark:border-slate-800">
                            <p className="text-4xl" style={{ fontFamily: '"Dancing Script", cursive' }}>
                                {typedName || 'Preview'}
                            </p>
                        </div>
                        <Button className="w-full" onClick={saveTyped} disabled={!typedName}>Create Signature</Button>
                    </TabsContent>
                    <TabsContent value="upload" className="space-y-4 py-4">
                        <div className="flex h-40 w-full items-center justify-center rounded-md border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">
                            <Label htmlFor="signature-upload-settings" className="flex cursor-pointer flex-col items-center gap-2">
                                <Upload className="size-8 text-slate-400" />
                                <span className="text-sm text-slate-500 dark:text-slate-400">Click to upload image</span>
                                <Input
                                    id="signature-upload-settings"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleUpload} />
                            </Label>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
