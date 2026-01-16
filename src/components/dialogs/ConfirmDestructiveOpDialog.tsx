import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const ConfirmDestructiveOpDialog = ({
    open,
    onOpenChange,
    onConfirm,
    title,
    children,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    title: string
    children: React.ReactNode
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                onInteractOutside={e => e.preventDefault()}
                onEscapeKeyDown={e => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="space-y-4">
                        {children}
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

export default ConfirmDestructiveOpDialog
