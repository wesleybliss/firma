import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/sonner'
import HomePage from './pages/home'
import SettingsPage from './pages/settings/SettingsPage'
import { useFirma } from '@/hooks/useFirma'
import { useFirebaseSync } from '@/hooks/useFirebaseSync'
import { useAuthStore } from '@/store/auth'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'

function App() {
    const { state, actions } = useFirma()
    const initializeAuth = useAuthStore((state) => state.initialize)
    
    // Initialize Firebase authentication
    useEffect(() => {
        initializeAuth()
    }, [initializeAuth])
    
    // Set up real-time sync with Firestore
    useFirebaseSync()

    return (
        <ThemeProvider defaultTheme="system" storageKey="firma-ui-theme">
            <BrowserRouter>
                <div className="min-h-screen bg-gradient-to-br from-slate-100
                    via-white to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100">

                    <Toaster richColors />

                    <input
                        ref={state.fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={actions.handleFileUpload}
                        className="hidden"/>

                    <div className="flex h-screen flex-col">
                        <Navbar state={state} actions={actions} />
                        <Routes>
                            <Route path="/" element={<HomePage state={state} actions={actions} />} />
                            <Route path="/settings" element={<SettingsPage />} />
                        </Routes>
                    </div>
                </div>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App