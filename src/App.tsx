import { Download, FileText, MousePointer2, Type, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { FeatureCard } from '@/components/FeatureCard'
import { PDFCanvas } from '@/components/PDFCanvas'
import { Sidebar } from '@/components/Sidebar'
import { Toolbar } from '@/components/Toolbar'
import { useFirma } from '@/hooks/useFirma'

function App() {
    const { state, actions } = useFirma()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900">
            <Toaster richColors />
            <input
                ref={state.fileInputRef}
                type="file"
                accept=".pdf"
                onChange={actions.handleFileUpload}
                className="hidden"
            />
            <div className="flex h-screen flex-col">
                <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
                    <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                                <FileText className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold tracking-tight text-slate-900">Firma</p>
                                <p className="text-xs text-slate-500">Fill, align, and export PDFs in seconds</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={actions.openFileDialog}>
                                <UploadCloud className="size-4" />
                                {state.pdfFile ? 'Replace PDF' : 'Choose PDF'}
                            </Button>
                            <Button variant="outline" size="sm" onClick={actions.addTextField} disabled={!state.pdfFile}>
                                <Type className="size-4" />
                                Add Text
                            </Button>
                            <Button size="sm" onClick={actions.handleDownload} disabled={!state.pdfFile || state.textFields.length === 0}>
                                <Download className="size-4" />
                                Export
                            </Button>
                        </div>
                    </div>
                </header>

                {state.pdfFile ? (
                    <div className="flex flex-1 overflow-hidden">
                        <Sidebar
                            fileName={state.fileName}
                            textFields={state.textFields}
                            activeFieldId={state.activeFieldId}
                            onAddTextField={actions.addTextField}
                            onRemoveTextField={actions.removeTextField}
                            onUpdateFieldProperty={actions.updateFieldProperty}
                            signatures={state.signatures}
                            onAddSignature={actions.addSignature}
                            onRemoveSignature={actions.removeSignature}
                            onPlaceSignature={actions.placeSignature}
                        />

                        <main className="flex-1 overflow-hidden px-4 py-6 sm:px-6">
                            <div className="mx-auto flex h-full max-w-5xl flex-col gap-6">
                                <Toolbar
                                    scale={state.scale}
                                    currentPage={state.currentPage}
                                    numPages={state.numPages}
                                    onZoomChange={actions.handleZoomChange}
                                    onZoomAdjust={actions.adjustZoom}
                                    onZoomReset={actions.resetZoom}
                                    onPageChange={actions.changePage}
                                />

                                <PDFCanvas
                                    pdfFile={state.pdfFile}
                                    scale={state.scale}
                                    currentPage={state.currentPage}
                                    textFields={state.textFields}
                                    activeFieldId={state.activeFieldId}
                                    pdfDimensions={state.pdfDimensions}
                                    onDocumentLoadSuccess={actions.onDocumentLoadSuccess}
                                    onPageLoadSuccess={actions.onPageLoadSuccess}
                                    onCanvasClick={actions.handleCanvasClick}
                                    onFieldClick={actions.setActiveFieldId}
                                    onFieldUpdate={actions.updateTextField}
                                    onFieldRemove={actions.removeTextField}
                                    onFieldPositionUpdate={actions.updateFieldPosition}
                                    onFieldDimensionsUpdate={actions.updateFieldDimensions}
                                    signatureFields={state.signatureFields}
                                    onSignatureRemove={actions.removeSignatureField}
                                    onSignaturePositionUpdate={actions.updateSignaturePosition}
                                    onSignatureDimensionsUpdate={actions.updateSignatureDimensions}
                                />
                            </div>
                        </main>

                        <aside className="hidden w-80 flex-col border-l border-slate-200 bg-white/70 px-6 py-6 lg:flex">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Inspector</p>
                            <div className="mt-4 flex-1 space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                {state.textFields.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-slate-500">
                                        <div className="size-6 text-slate-300">
                                            <FileText className="size-6" />
                                        </div>
                                        Add a text field to see it here.
                                    </div>
                                ) : (
                                    state.textFields.map((field, index) => {
                                        const isActive = state.activeFieldId === field.id
                                        return (
                                            <div
                                                key={field.id}
                                                className={`rounded-xl border p-4 transition-colors ${isActive ? 'border-sky-500 bg-sky-50/70' : 'border-slate-200 bg-white hover:border-slate-300'
                                                    }`}
                                            >
                                                <div className="mb-3 flex items-center justify-between">
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Field {index + 1}</p>
                                                    <Button variant="ghost" size="icon-sm" onClick={() => actions.removeTextField(field.id)}>
                                                        <div className="size-4 text-slate-400">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                                        </div>
                                                    </Button>
                                                </div>
                                                <input
                                                    value={field.text}
                                                    onChange={event => actions.updateTextField(field.id, event.target.value)}
                                                    onFocus={() => actions.setActiveFieldId(field.id)}
                                                    placeholder="Enter text"
                                                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
                                                />
                                                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                                                    <span>X: {(field.x * 100).toFixed(0)}%</span>
                                                    <span>Y: {(field.y * 100).toFixed(0)}%</span>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </aside>
                    </div>
                ) : (
                    <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
                        <div className="relative w-full max-w-4xl space-y-12">
                            <div className="pointer-events-none absolute -inset-24 rounded-[3rem] bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.12),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.1),_transparent_60%)]" />
                            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-12 shadow-2xl backdrop-blur">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white">
                                    <UploadCloud className="size-7" />
                                </div>
                                <div className="mt-8 space-y-4 text-center">
                                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Drop in your PDF and start editing instantly</h1>
                                    <p className="text-base text-slate-500 sm:text-lg">
                                        Firma runs entirely in your browser. Place text anywhere, keep your data private, and export a polished document when you’re ready.
                                    </p>
                                </div>
                                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                                    <Button size="lg" onClick={actions.openFileDialog}>
                                        <UploadCloud className="size-5" />
                                        Choose PDF
                                    </Button>
                                    <Button variant="outline" size="lg" onClick={actions.addTextField} disabled>
                                        <Type className="size-5" />
                                        Add Text Field
                                    </Button>
                                </div>
                            </div>

                            <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <FeatureCard
                                    icon={<FileText className="size-5 text-slate-900" />}
                                    title="Precise placement"
                                    description="Drag fields with pixel-perfect control on a crisp PDF preview."
                                />
                                <FeatureCard
                                    icon={<MousePointer2 className="size-5 text-slate-900" />}
                                    title="Simple editing"
                                    description="Click any field to edit the text, size, or position instantly."
                                />
                                <FeatureCard
                                    icon={<Download className="size-5 text-slate-900" />}
                                    title="Private export"
                                    description="Everything happens locally. Download a flattened PDF in one click."
                                />
                            </div>
                        </div>
                    </main>
                )}
            </div>
        </div>
    )
}

export default App