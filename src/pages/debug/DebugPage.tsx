import { useRef, useState, useEffect } from 'react'
import StyledCanvas from '@/components/StyledCanvas'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type Data = {
    isDarkModeForced: boolean
    hasInvertedColors: boolean
}

const DebugPage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [data, setData] = useState<Data>()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    useEffect(() => {

        const isDarkModeForced = window.matchMedia('(prefers-color-scheme: dark)').matches

        // Or check for inverted colors specifically
        const hasInvertedColors = window.matchMedia('(inverted-colors: inverted)').matches

        setData({
            isDarkModeForced,
            hasInvertedColors,
        })

    }, [])

    return (
        <div className="flex flex-col gap-8 p-8">
            <div className="border-4 border-slate-200 p-4">
                <h1>Sample Dialog</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent
                        showCloseButton={false}
                        onInteractOutside={(e) => e.preventDefault()}
                        onEscapeKeyDown={(e) => e.preventDefault()}>
                        <DialogHeader>
                            <DialogTitle>Sample Modal Dialog</DialogTitle>
                            <DialogDescription>
                                This is a modal dialog that cannot be closed by clicking outside or pressing Escape.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                console.log('OK clicked')
                                setIsDialogOpen(false)
                            }}>
                                OK
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="border-4 border-red-200 p-4">
                <h1>Debug Data</h1>
                <div>
                    <StyledCanvas
                        className=""
                        width={600}
                        height={300}
                        ref={canvasRef} />
                </div>
                <div><pre><code className="bg-white text-black">
                    {JSON.stringify(data, null, 2)}
                </code></pre></div>
            </div>
        </div>
    )
}

export default DebugPage
