import { Download, FileText, MousePointer2, Type, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FeatureCard } from '@/components/FeatureCard'
import BraveDebug from '@/components/BraveDebug'

const AppLanding = ({
    actions,
}: {
    actions: any
}) => {

    return (
        <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
            <div className="relative w-full max-w-4xl space-y-12">
                {/* <BraveDebug /> */}
                <div className="pointer-events-none absolute -inset-24 rounded-[3rem]
                    bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.12),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(59,130,246,0.1),_transparent_60%)]
                    " />
                <div className="relative overflow-hidden rounded-3xl border border-slate-200
                    dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 p-12 shadow-2xl backdrop-blur">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white">
                        <UploadCloud className="size-7" />
                    </div>
                    <div className="mt-8 space-y-4 text-center">
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                            Drop in your PDF and start editing instantly
                        </h1>
                        <p className="text-base text-slate-500 sm:text-lg">
                            Firma runs entirely in your browser. Place text anywhere, keep your data private, and export a polished document when you’re ready.
                        </p>
                    </div>
                    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Button size="lg" onClick={actions.openFileDialog}>
                            <UploadCloud className="size-5" />
                            Choose PDF
                        </Button>
                    </div>
                </div>

                <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <FeatureCard
                        icon={<FileText className="size-5 text-slate-900 dark:text-slate-100" />}
                        title="Precise placement"
                        description="Drag fields with pixel-perfect control on a crisp PDF preview."/>
                    <FeatureCard
                        icon={<MousePointer2 className="size-5 text-slate-900 dark:text-slate-100" />}
                        title="Simple editing"
                        description="Click any field to edit the text, size, or position instantly."/>
                    <FeatureCard
                        icon={<Download className="size-5 text-slate-900 dark:text-slate-100" />}
                        title="Private export"
                        description="Everything happens locally. Download a flattened PDF in one click."/>
                </div>
            </div>
        </main>
    )

}

export default AppLanding
