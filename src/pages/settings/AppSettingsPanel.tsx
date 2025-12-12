import { useMemo } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddSignatureDialog } from '@/components/dialogs/AddSignatureDialog'
import { useSignaturesStore } from '@/store/signatures'
import { DocumentState, useDocumentsStore } from '@/store/documents'
import { formatDate } from '@/lib/dateUtils'

const AppSettingsPanel = () => {
    const { signatures, removeSignature } = useSignaturesStore()
    const { savedStates, clearDocumentState, clearAllDocumentStates } = useDocumentsStore()

    const documents = useMemo(() => (
        Object.values(savedStates)
            .slice(0, 100)
            .sort((a, b) => b.lastModified - a.lastModified)
    ), [savedStates])

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

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Previously Seen Documents
                    </h2>
                    <Button size="sm" onClick={clearAllDocumentStates}>
                        <Trash2 className="mr-2 size-4" />
                        Clear All
                    </Button>
                </div>

                <div className="max-h-[480px] overflow-y-auto rounded-xl border
                    border-slate-200 bg-white p-4 dark:bg-white">
                    {Object.keys(documents).length === 0 && (
                        <div className="text-center text-slate-500">
                            No documents seen yet
                        </div>
                    )}

                    {Object.keys(documents).length > 0 && (
                        <div className="space-y-2 [&>*:nth-child(even)]:bg-slate-50">
                            {documents.map((doc: DocumentState) => (
                                <div
                                    key={doc.hash}
                                    className="flex items-center justify-between rounded-md p-2
                                        text-sm text-slate-700 transition-colors
                                        hover:bg-slate-100 dark:text-slate-300
                                        dark:hover:bg-slate-700">
                                    <span className="w-[250px]">{doc.fileName}</span>
                                    <span className="text-xs">
                                        {formatDate(new Date(doc.lastModified), 'DD/MM/YYYY')}
                                    </span>
                                    <span className="text-xs" title="Text Fields / Signature Fields">
                                        {doc.textFields.length} / {doc.signatureFields.length}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() => clearDocumentState(doc.hash)}>
                                        <Trash2 className="size-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default AppSettingsPanel
