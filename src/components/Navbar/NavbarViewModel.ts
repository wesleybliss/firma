import { useMemo } from 'react'
import { useAuthStore } from '@/store/auth'
import { usePdfStore } from '@/store/pdf'
import { useCanvasStore } from '@/store/canvas'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { generateSignedPdf } from '@/lib/pdfGenerator'

const NavbarViewModel = () => {
    const { user, signInWithGoogle, signOut } = useAuthStore()
    const navigate = useNavigate()
    const {
        pdfFile, fileName, scale, currentPage, numPages,
        changePage, zoomIn, zoomOut, resetZoom,
    } = usePdfStore()
    const { textFields, signatureFields } = useCanvasStore()

    const isLocalhost = useMemo(() => (
        ['localhost', '127.0.0.1', '0.0.0.0', '192.168']
            .some(it => window.location.hostname.startsWith(it))
    ), [])

    const handleSignIn = async () => {
        try {
            await signInWithGoogle()
            toast.success('Signed in successfully')
        } catch {
            toast.error('Failed to sign in')
        }
    }

    const handleSignOut = async () => {
        try {
            await signOut()
            toast.success('Signed out successfully')
        } catch {
            toast.error('Failed to sign out')
        }
    }

    const handleDownload = async () => {
        if (!pdfFile) return
        await generateSignedPdf(pdfFile, fileName, textFields, signatureFields)
    }

    return {
        user,
        signInWithGoogle,
        signOut,
        navigate,
        isLocalhost,
        pdfFile,
        fileName,
        scale,
        currentPage,
        numPages,
        changePage,
        zoomIn,
        zoomOut,
        resetZoom,
        textFields,
        signatureFields,
        handleSignIn,
        handleSignOut,
        handleDownload,
    }
}

export default NavbarViewModel
