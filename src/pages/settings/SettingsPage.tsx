import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Plus, Trash2, Upload, Type, Pen } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUserStore } from '@/store/user'
import { useSignaturesStore } from '@/store/signatures'
import { useDefaultsStore } from '@/store/defaults'
import { GOOGLE_FONTS } from '@/lib/fonts'

const SettingsPage = () => {
    const userStore = useUserStore()
    const { signatures, addSignature, removeSignature } = useSignaturesStore()
    const { fontFamily, fontSize, setFontFamily, setFontSize } = useDefaultsStore()

    // Signature Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('draw')
    const [typedName, setTypedName] = useState('')
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)

    // Drawing logic (reused from SignatureManager)
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
        setIsDialogOpen(false)
        clearCanvas()
    }

    const saveTyped = () => {
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
            id: crypto.randomUUID(),
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
                id: crypto.randomUUID(),
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
        <div className="container mx-auto max-w-2xl px-4 py-8">
            <div className="mb-8 flex items-center gap-4">
                <Link to="/" className={buttonVariants({ variant: "ghost", size: "icon" })}>
                    <ChevronLeft className="size-5" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            </div>

            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">Profile Information</h2>
                    <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={userStore.name}
                                onChange={(e) => userStore.setName(e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="initials">Initials</Label>
                                <Input
                                    id="initials"
                                    value={userStore.initials}
                                    onChange={(e) => userStore.setInitials(e.target.value)}
                                    placeholder="JD"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={userStore.phone}
                                    onChange={(e) => userStore.setPhone(e.target.value)}
                                    placeholder="(555) 000-0000"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={userStore.email}
                                onChange={(e) => userStore.setEmail(e.target.value)}
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="company">Company</Label>
                            <Input
                                id="company"
                                value={userStore.company}
                                onChange={(e) => userStore.setCompany(e.target.value)}
                                placeholder="Acme Inc."
                            />
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Default Font Settings
                    </h2>
                    <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="grid gap-2">
                            <Label htmlFor="font-family">Font Family</Label>
                            <select
                                id="font-family"
                                value={fontFamily}
                                onChange={(e) => setFontFamily(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {GOOGLE_FONTS.map((font) => (
                                    <option key={font.family} value={font.family}>
                                        {font.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="font-size">Font Size</Label>
                            <Input
                                id="font-size"
                                type="number"
                                min="8"
                                max="72"
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">Signatures</h2>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="mr-2 size-4" />
                                    Add Signature
                                </Button>
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
                                            <Label htmlFor="signature-name">Your Name</Label>
                                            <Input
                                                id="signature-name"
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
                                            <Label htmlFor="signature-upload-settings" className="flex cursor-pointer flex-col items-center gap-2">
                                                <Upload className="size-8 text-slate-400" />
                                                <span className="text-sm text-slate-500">Click to upload image</span>
                                                <Input
                                                    id="signature-upload-settings"
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

                    <div className="grid gap-4 sm:grid-cols-2">
                        {signatures.length === 0 ? (
                            <div className="col-span-full rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
                                No signatures saved yet
                            </div>
                        ) : (
                            signatures.map(signature => (
                                <div
                                    key={signature.id}
                                    className="group relative flex h-32 items-center justify-center rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-sky-500 hover:shadow-sm"
                                >
                                    <img src={signature.dataUrl} alt="Signature" className="max-h-full max-w-full object-contain" />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                                        onClick={() => removeSignature(signature.id)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default SettingsPage
