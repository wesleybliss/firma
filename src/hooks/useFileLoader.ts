import { ChangeEvent } from 'react'
import { toast } from 'sonner'
import { hashFile } from '@/lib/utils'
import { usePdfStore } from '@/store/pdf'
import { useDocumentsStore } from '@/store/documents'
import { useCanvasStore } from '@/store/canvas'
import { ZOOM_MAX } from '@/lib/constants'

export function useFileLoader() {
    const {
        setPdfFile,
        setFileName,
        setPdfHash,
        setScale,
    } = usePdfStore()

    // setActiveFieldId is in canvas store
    const { setTextFields, setSignatureFields, setActiveFieldId } = useCanvasStore()
    const { loadDocumentState } = useDocumentsStore()

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            const hash = await hashFile(file)
            setPdfHash(hash)

            const savedState = await loadDocumentState(hash)

            const reader = new FileReader()
            reader.onloadend = () => {
                setPdfFile(reader.result as string)
                setFileName(file.name)

                if (savedState) {
                    setTextFields(savedState.textFields)
                    setSignatureFields(savedState.signatureFields)
                    toast.success('Restored previous session')
                } else {
                    setTextFields([])
                    setSignatureFields([])
                    toast.success('PDF is ready to edit')
                }

                setActiveFieldId(null)
                setScale(ZOOM_MAX)
            }
            reader.readAsDataURL(file)
        } catch (error) {
            console.error('Error processing file:', error)
            toast.error('Error opening file')
        }

        event.target.value = ''
    }

    return { handleFileUpload }
}
