import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'
import UserSettingsPanel from './UserSettingsPanel'
import AppSettingsPanel from './AppSettingsPanel'
import { useState } from 'react'
import ConfirmDestructiveOpDialog from '@/components/dialogs/ConfirmDestructiveOpDialog'

const SettingsPage = () => {
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

    const handleReset = () => {
        setIsResetDialogOpen(true)
    }

    const confirmReset = () => {
        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.startsWith(APP_NAME.toLowerCase())) {
                keysToRemove.push(key)
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key))
        window.location.reload()
    }

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">

            <div className="mb-8 flex items-center gap-4">
                <Link to="/" className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
                    <ChevronLeft className="size-5" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Settings
                </h1>
            </div>

            <div className="grid grid-cols-2 gap-8 space-y-8">
                <UserSettingsPanel />
                <AppSettingsPanel />
            </div>

            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
                        Danger Zone
                    </h2>
                    <div className="rounded-xl border border-red-200 bg-red-50
                        p-6 dark:border-red-900/50 dark:bg-red-900/20">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="font-medium text-red-900 dark:text-red-200">
                                    Reset Data
                                </h3>
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    Clear all local data and reload from the server. This will not delete your
                                    account.
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={handleReset}>
                                Reset Data
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
            <ConfirmDestructiveOpDialog
                open={isResetDialogOpen}
                onOpenChange={setIsResetDialogOpen}
                onConfirm={confirmReset}
                title="Reset All Data">
                <p>Are you sure you want to clear all data? This action cannot be undone.</p>
            </ConfirmDestructiveOpDialog>
        </div>
    )
}

export default SettingsPage
