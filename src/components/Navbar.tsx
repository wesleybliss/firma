import { Download, FileText, Type, UploadCloud, User, Hash, Mail, Phone, Building, Calendar } from 'lucide-react'
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
                    {/* <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => actions.addTextField('text')} disabled={!state.pdfFile}>
                            <Type className="size-4" />
                            Text
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => actions.addTextField('date')} disabled={!state.pdfFile}>
                            <Calendar className="size-4" />
                            Date
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => actions.addTextField('fullName')} disabled={!state.pdfFile}>
                            <User className="size-4" />
                            Name
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => actions.addTextField('initials')} disabled={!state.pdfFile}>
                            <Hash className="size-4" />
                            Initials
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => actions.addTextField('email')} disabled={!state.pdfFile}>
                            <Mail className="size-4" />
                            Email
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => actions.addTextField('phone')} disabled={!state.pdfFile}>
                            <Phone className="size-4" />
                            Phone
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => actions.addTextField('company')} disabled={!state.pdfFile}>
                            <Building className="size-4" />
                            Company
                        </Button>
                    </div> */}
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
