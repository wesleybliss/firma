import { Download, UploadCloud, LogIn, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toolbar } from '@/components/Toolbar'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ThemeToggle from '@/components/ThemeToggle'
import { APP_NAME } from '@/lib/constants'

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
        <header className="w-full border-b border-slate-200
            dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur">

            <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6">

                <div className="flex items-center gap-3">
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
                </div>

                {state.pdfFile && <Toolbar
                    scale={state.scale}
                    currentPage={state.currentPage}
                    numPages={state.numPages}
                    onZoomChange={actions.handleZoomChange}
                    onZoomAdjust={actions.adjustZoom}
                    onZoomReset={actions.resetZoom}
                    onPageChange={actions.changePage} />}

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={actions.openFileDialog}>
                        <UploadCloud className="size-4" />
                        {state.pdfFile ? 'Replace PDF' : 'Choose PDF'}
                    </Button>
                    <Button
                        size="sm"
                        onClick={actions.handleDownload}
                        disabled={!state.pdfFile || state.textFields.length === 0}>
                        <Download className="size-4" />
                        Export
                    </Button>
                    <ThemeToggle />
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2 px-2 hover:bg-slate-100
                                        dark:hover:bg-slate-700 data-[state=open]:bg-slate-100
                                        dark:data-[state=open]:bg-slate-700">
                                    {user.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={user.displayName || 'User'}
                                            className="size-6 rounded-full" />
                                    ) : (
                                        <div className="size-6 rounded-full bg-slate-200" />
                                    )}
                                    {/* <span className="text-sm font-medium
                                        text-slate-700 dark:text-slate-100 hidden sm:inline">
                                        {user.displayName || user.email}
                                    </span> */}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 dark:bg-slate-900">
                                <DropdownMenuLabel>
                                    <h5 className="text-base font-semibold">{user.displayName || 'Anonymous'}</h5>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">{user.email}</span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to="/settings" className="cursor-pointer w-full flex items-center">
                                        <Settings className="mr-2 size-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleSignOut}
                                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                    <LogOut className="mr-2 size-4" />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant="outline" size="sm" onClick={handleSignIn}>
                            <LogIn className="size-4" />
                            Sign in with Google
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )

}

export default Navbar
