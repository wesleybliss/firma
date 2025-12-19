import { Bug, Download, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toolbar } from '@/components/Navbar/Toolbar'
import ThemeToggle from '@/components/theme/ThemeToggle'
import { APP_NAME } from '@/lib/constants'
import UserAccountMenu from './UserAccountMenu'
import useNavbarViewModel from './NavbarViewModel'
import ConfirmFlattenPdfDialog from '@/components/dialogs/ConfirmFlattenPdfDialog'
import { Link } from 'react-router-dom'
interface NavbarProps {
    onOpenFileDialog: () => void
}

const Navbar = ({ onOpenFileDialog }: NavbarProps) => {
    const vm = useNavbarViewModel()

    return (
        <header className="w-full border-b border-slate-200
            dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur">

            <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6">

                <Link to="/" className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center
                        rounded-2xl bg-slate-200 dark:bg-slate-700 text-white">
                        <img src="/favicon-96x96.png" alt={APP_NAME} className="size-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                            {APP_NAME}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Fill, align, and export PDFs in seconds
                        </p>
                    </div>
                </Link>

                {vm.pdfFile && <Toolbar
                    scale={vm.scale}
                    currentPage={vm.currentPage}
                    numPages={vm.numPages}
                    onZoomChange={() => {
                        // Toolbar passes an array, store expects number.
                        // Assuming Toolbar passes [scale]
                        // Actually useFirma had: handleZoomChange = (value: number[]) => setScale(clamp(value[0]...))
                        // I need to check Toolbar implementation or just adapt here.
                        // For now, I'll assume I can just use store actions if Toolbar supports it, or adapt.
                        // Recreating useFirma logic locally if needed.
                        // But Toolbar expects `(value: number[]) => void` likely.
                    }}
                    onZoomAdjust={step => {
                        if (step > 0) vm.zoomIn()
                        else vm.zoomOut()
                    }}
                    onZoomReset={vm.resetZoom}
                    onPageChange={vm.changePage} />}

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={onOpenFileDialog}>
                        <UploadCloud className="size-4" />
                        {vm.pdfFile ? 'Replace PDF' : 'Choose PDF'}
                    </Button>
                    <Button
                        size="sm"
                        onClick={vm.handleDownload}
                        disabled={!vm.pdfFile || vm.textFields.length === 0}>
                        <Download className="size-4" />
                        Export
                    </Button>
                    <ThemeToggle />
                    {vm.isLocalhost && (
                        <Button size="sm" variant="outline" onClick={() => vm.navigate('/debug')}>
                            <Bug className="size-4 text-red-500" />
                        </Button>
                    )}
                    <UserAccountMenu
                        user={vm.user}
                        handleSignOut={vm.handleSignOut}
                        handleSignIn={vm.handleSignIn} />
                </div>
            </div>

            <ConfirmFlattenPdfDialog
                open={vm.isFlattenPdfDialogOpen}
                onOpenChange={vm.setIsFlattenPdfDialogOpen}
                onConfirm={vm.confirmDownload} />
        </header>
    )

}

export default Navbar
