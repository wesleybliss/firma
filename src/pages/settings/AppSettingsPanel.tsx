import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddSignatureDialog } from '@/components/AddSignatureDialog'
import { useSignaturesStore } from '@/store/signatures'

const AppSettingsPanel = () => {
    const { signatures, removeSignature } = useSignaturesStore()
    return (
        <div className="space-y-8">
            <section className="space-y-4">

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Signatures
                    </h2>
                    <AddSignatureDialog />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {signatures.length === 0 ? (
                        <div className="col-span-full rounded-xl border border-dashed
                            border-slate-200 p-8 text-center text-slate-500">
                            No signatures saved yet
                        </div>
                    ) : (
                        signatures.map(signature => (
                            <div
                                key={signature.id}
                                className="group relative flex h-32 items-center justify-center rounded-xl
                                    border border-slate-200 bg-white dark:bg-white p-4 transition-all
                                    hover:border-sky-500 hover:shadow-sm">
                                <img
                                    src={signature.dataUrl}
                                    alt="Signature"
                                    className="max-h-full max-w-full object-contain" />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute right-2 top-2 h-8 w-8 opacity-0
                                        transition-opacity group-hover:opacity-100"
                                    onClick={() => removeSignature(signature.id)}>
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    )
}

export default AppSettingsPanel
