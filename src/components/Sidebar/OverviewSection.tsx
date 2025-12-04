import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Settings, Sparkles } from 'lucide-react'
import { TextField } from '@/types'

const OverviewSection = ({
    fileName,
    textFields
}: {
    fileName: string | null
    textFields: TextField[]
}) => {

    return (
        <section>

            <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Overview
                </p>
                <Link to="/settings">
                    <Button variant="ghost" size="icon">
                        <Settings className="size-4" />
                    </Button>
                </Link>
            </div>

            <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                    <Sparkles className="mt-1 size-4 text-slate-400" />
                    <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {fileName ?? 'Untitled.pdf'}
                        </p>
                        <p className="text-xs text-slate-500">
                            {textFields.length} field{textFields.length === 1 ? '' : 's'}
                        </p>
                    </div>
                </div>
            </div>

        </section>

    )

}

export default OverviewSection
