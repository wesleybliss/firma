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

const SampleDialog = ({
    isDialogOpen,
    setIsDialogOpen,
}: {
    isDialogOpen: boolean
    setIsDialogOpen: (open: boolean) => void
}) => {
    return (
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
    )
}

export default SampleDialog
