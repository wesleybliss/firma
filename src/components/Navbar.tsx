import { Download, FileText, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toolbar } from '@/components/Toolbar'

const Navbar = ({ state, actions }: { state: any, actions: any }) => {

    return (
        <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur">

            <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6">

                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                        <FileText className="size-5" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold tracking-tight text-slate-900">Firma</p>
                        <p className="text-xs text-slate-500">Fill, align, and export PDFs in seconds</p>
                    </div>
                </div>

                {state.pdfFile && <Toolbar
                    scale={state.scale}
                    currentPage={state.currentPage}
                    numPages={state.numPages}
                    onZoomChange={actions.handleZoomChange}
                    onZoomAdjust={actions.adjustZoom}
                    onZoomReset={actions.resetZoom}
                    onPageChange={actions.changePage}
                />}

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={actions.openFileDialog}>
                        <UploadCloud className="size-4" />
                        {state.pdfFile ? 'Replace PDF' : 'Choose PDF'}
                    </Button>
                    <Button size="sm" onClick={actions.handleDownload} disabled={!state.pdfFile || state.textFields.length === 0}>
                        <Download className="size-4" />
                        Export
                    </Button>
                </div>
            </div>
        </header>
    )

}

export default Navbar
