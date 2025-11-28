import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/sonner'
import AppLanding from '@/components/AppLanding'
import AppReady from '@/components/AppReady'
import { useFirma } from '@/hooks/useFirma'

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
                    <AppReady state={state} actions={actions} />
                ) : (
                    <AppLanding actions={actions} />
                )}
            </div>
        </div>
    )
}

export default App