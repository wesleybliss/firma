import { Download, FileText, UploadCloud, LogIn, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toolbar } from '@/components/Toolbar'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'

const Navbar = ({ state, actions }: { state: any, actions: any }) => {
    const { user, signInWithGoogle, signOut } = useAuthStore()

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
                    {user ? (
                        <>
                            <div className="flex items-center gap-2 mr-2">
                                {user.photoURL && (
                                    <img 
                                        src={user.photoURL} 
                                        alt={user.displayName || 'User'}
                                        className="size-8 rounded-full"
                                    />
                                )}
                                <span className="text-sm text-slate-700 hidden sm:inline">
                                    {user.displayName || user.email}
                                </span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleSignOut}>
                                <LogOut className="size-4" />
                                Sign out
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" size="sm" onClick={handleSignIn}>
                            <LogIn className="size-4" />
                            Sign in with Google
                        </Button>
                    )}
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
