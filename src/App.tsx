import Navbar from '@/components/Navbar'
import { Download, FileText, MousePointer2, Type, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { FeatureCard } from '@/components/FeatureCard'
import { PDFCanvas } from '@/components/PDFCanvas'
import { Sidebar } from '@/components/Sidebar'

import { useFirma } from '@/hooks/useFirma'
import InspectorSidebar from './components/InspectorSidebar'

function App() {
    const { state, actions } = useFirma()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100
            via-white to-slate-200 text-slate-900">

            <Toaster richColors />

            <input
                ref={state.fileInputRef}
                type="file"
                accept=".pdf"
                onChange={actions.handleFileUpload}
                className="hidden"
            />

            <div className="flex h-screen flex-col">
                <Navbar state={state} actions={actions} />

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

                        <main className="flex-1 overflow-hidden">
                            <div className="flex h-full flex-col gap-6">
                                {/* <Toolbar
                                    scale={state.scale}
                                    currentPage={state.currentPage}
                                    numPages={state.numPages}
                                    onZoomChange={actions.handleZoomChange}
                                    onZoomAdjust={actions.adjustZoom}
                                    onZoomReset={actions.resetZoom}
                                    onPageChange={actions.changePage}
                                /> */}

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

                        <InspectorSidebar state={state} actions={actions} />
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