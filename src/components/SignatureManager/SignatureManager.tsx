import { useEffect } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Plus, ChevronDown } from 'lucide-react'
import StyledCanvas from '@/components/StyledCanvas'
import SignatureImage from './SignatureImage'
import useSignatureManager from '@/hooks/useSignatureManager'

interface SignatureManagerProps {
    onPlaceSignature: (id: string) => void
}

const SignatureManager = ({
    onPlaceSignature,
}: SignatureManagerProps) => {

    const vm = useSignatureManager()

    useEffect(() => {
        if (!vm.isOpen || vm.activeTab === 'draw') return

        // Initialize canvas context settings
        setTimeout(() => {
            const canvas = vm.canvasRef.current
            if (canvas) {
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    ctx.lineWidth = 2
                    ctx.lineCap = 'round'
                    ctx.strokeStyle = 'black'
                }
            }
        }, 100)
    }, [vm.activeTab, vm.isOpen, vm.canvasRef])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Signatures</p>
                <Dialog open={vm.isOpen} onOpenChange={vm.setIsOpen}>
                    <DialogTrigger className={buttonVariants({ variant: 'ghost', size: 'icon-sm' })}>
                        <Plus className="size-4" />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Signature</DialogTitle>
                        </DialogHeader>
                        <Tabs value={vm.activeTab} onValueChange={vm.setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="draw">Draw</TabsTrigger>
                                <TabsTrigger value="type">Type</TabsTrigger>
                                <TabsTrigger value="upload">Upload</TabsTrigger>
                            </TabsList>
                            <TabsContent value="draw" className="space-y-4 py-4">
                                <div className="rounded-md border border-slate-200 bg-white p-1">
                                    <StyledCanvas
                                        ref={vm.canvasRef}
                                        width={400}
                                        height={200}
                                        className="w-full"
                                        onMouseDown={vm.startDrawing}
                                        onMouseMove={vm.draw}
                                        onMouseUp={vm.stopDrawing}
                                        onMouseLeave={vm.stopDrawing}
                                        onTouchStart={vm.startDrawing}
                                        onTouchMove={vm.draw}
                                        onTouchEnd={vm.stopDrawing} />
                                </div>
                                <div className="flex justify-between">
                                    <Button variant="outline" size="sm" onClick={vm.clearCanvas}>Clear</Button>
                                    <Button size="sm" onClick={vm.saveDrawing}>Create Signature</Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="type" className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Your Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={vm.typedName}
                                        onChange={e => vm.setTypedName(e.target.value)} />
                                </div>
                                <div className="flex h-32 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
                                    <p className="text-4xl" style={{ fontFamily: '"Dancing Script", cursive' }}>
                                        {vm.typedName || 'Preview'}
                                    </p>
                                </div>
                                <Button className="w-full" onClick={vm.saveTyped} disabled={!vm.typedName}>Create Signature</Button>
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
                                            onChange={vm.handleUpload} />
                                    </Label>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-2">
                {vm.signatures.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500">
                        No signatures yet
                    </div>
                ) : (
                    <>
                        {(vm.showAll ? vm.signatures : vm.signatures.slice(0, 3)).map(signature => (
                            <SignatureImage
                                key={signature.id}
                                signature={signature}
                                onPlaceSignature={onPlaceSignature}
                                removeSignature={vm.removeSignature} />
                        ))}
                        {vm.signatures.length > 3 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-center text-xs font-medium"
                                onClick={() => vm.setShowAll(!vm.showAll)}>
                                {vm.showAll ? 'Show Less' : `Show All (${vm.signatures.length})`}
                                <ChevronDown className={`ml-1 size-3 transition-transform ${vm.showAll ? 'rotate-180' : ''}`} />
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default SignatureManager
