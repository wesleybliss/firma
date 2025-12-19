import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const ConfirmFlattenPdfDialog = ({
    open,
    onOpenChange,
    onConfirm,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Export Flattened PDF</DialogTitle>
                    <DialogDescription className="space-y-4">
                        <p>This document contains editable fields, which will be removed from the document.</p>
                        <p>Are you sure you want to export the flattened PDF?</p>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        onConfirm()
                        onOpenChange(false)
                    }}>
                        OK
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmFlattenPdfDialog
