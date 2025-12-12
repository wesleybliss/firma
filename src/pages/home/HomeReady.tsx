import { useEffect } from 'react'
import { PDFCanvas } from '@/components/Document/PDFCanvas'
import Sidebar from '@/components/Sidebar'
import InspectorSidebar from '@/components/Sidebar/InspectorSidebar'
import { usePdfStore } from '@/store/pdf'
import { useCanvasStore } from '@/store/canvas'
import { useDocumentsStore } from '@/store/documents'

const HomeReady = () => {
    const { pdfHash, fileName } = usePdfStore()
    const { textFields, signatureFields } = useCanvasStore()
    const { saveDocumentState } = useDocumentsStore()

    // Auto-save effect
    useEffect(() => {
        if (!pdfHash || !fileName) return

        const timeoutId = setTimeout(() => {
            saveDocumentState(pdfHash, {
                hash: pdfHash,
                textFields,
                signatureFields,
                lastModified: Date.now(),
                fileName,
            })
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [textFields, signatureFields, pdfHash, fileName, saveDocumentState])

    return (
        <div className="flex flex-1 overflow-hidden">
            <Sidebar />

            <main className="flex-1 overflow-hidden">
                <div className="flex h-full flex-col gap-6">
                    <PDFCanvas />
                </div>
            </main>

            <InspectorSidebar />
        </div>
    )
}

export default HomeReady
