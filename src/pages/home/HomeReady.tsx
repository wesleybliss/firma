import { PDFCanvas } from '@/components/PDFCanvas'
import { Sidebar } from '@/components/Sidebar'
import InspectorSidebar from '@/components/InspectorSidebar'

const AppReady = ({
    state,
    actions,
}: {
    state: any
    actions: any
}) => {

    return (
        <div className="flex flex-1 overflow-hidden">
            <Sidebar
                fileName={state.fileName}
                textFields={state.textFields}
                activeFieldId={state.activeFieldId}
                onAddTextField={actions.addTextField}
                onRemoveTextField={actions.removeTextField}
                onUpdateFieldProperty={actions.updateFieldProperty}
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
    )

}

export default AppReady
