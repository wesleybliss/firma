import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/sonner'
import HomePage from './pages/home'
import SettingsPage from './pages/settings/SettingsPage'
import { useFirma } from '@/hooks/useFirma'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
    const { state, actions } = useFirma()

    return (
        <BrowserRouter>
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
                    <Routes>
                        <Route path="/" element={<HomePage state={state} actions={actions} />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App