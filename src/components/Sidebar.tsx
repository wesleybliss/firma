import { Download, Plus, Sparkles, UploadCloud, User, Hash, Mail, Phone, Building, Type, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TextProperties } from '@/components/TextProperties'
import { SignatureManager } from '@/components/SignatureManager'
import { TextField, Signature, FieldType } from '@/types'

interface SidebarProps {
    fileName: string | null
    textFields: TextField[]
    activeFieldId: string | null
    onAddTextField: (fieldType?: FieldType) => void
    onRemoveTextField: (id: string) => void
    onUpdateFieldProperty: (id: string, property: keyof TextField, value: any) => void
    signatures: Signature[]
    onAddSignature: (signature: Signature) => void
    onRemoveSignature: (id: string) => void
    onPlaceSignature: (id: string) => void
}

export function Sidebar({
    fileName,
    textFields,
    activeFieldId,
    onAddTextField,
    onRemoveTextField,
    onUpdateFieldProperty,
    signatures,
    onAddSignature,
    onRemoveSignature,
    onPlaceSignature,
}: SidebarProps) {
    const activeField = textFields.find(f => f.id === activeFieldId)

    return (
        <aside className="hidden w-72 border-r border-slate-200 bg-white/70 px-6 py-6 md:flex md:flex-col md:gap-8">
            <section>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Overview</p>
                <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                        <Sparkles className="mt-1 size-4 text-slate-400" />
                        <div>
                            <p className="text-sm font-medium text-slate-900">{fileName ?? 'Untitled.pdf'}</p>
                            <p className="text-xs text-slate-500">{textFields.length} field{textFields.length === 1 ? '' : 's'}</p>
                        </div>
                    </div>
                    <div className="mt-6 space-y-1">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Add Field</p>
                        <div className="grid grid-cols-2 gap-1">
                            <Button variant="ghost" size="sm" className="justify-start" onClick={() => onAddTextField('text')}>
                                <Type className="size-3" />
                                <span className="text-xs">Text</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="justify-start" onClick={() => onAddTextField('date')}>
                                <Calendar className="size-3" />
                                <span className="text-xs">Date</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="justify-start" onClick={() => onAddTextField('fullName')}>
                                <User className="size-3" />
                                <span className="text-xs">Name</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="justify-start" onClick={() => onAddTextField('initials')}>
                                <Hash className="size-3" />
                                <span className="text-xs">Initials</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="justify-start" onClick={() => onAddTextField('email')}>
                                <Mail className="size-3" />
                                <span className="text-xs">Email</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="justify-start" onClick={() => onAddTextField('phone')}>
                                <Phone className="size-3" />
                                <span className="text-xs">Phone</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="justify-start" onClick={() => onAddTextField('company')}>
                                <Building className="size-3" />
                                <span className="text-xs">Company</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <SignatureManager
                signatures={signatures}
                onAddSignature={onAddSignature}
                onRemoveSignature={onRemoveSignature}
                onPlaceSignature={onPlaceSignature}
            />

            {activeField ? (
                <TextProperties
                    field={activeField}
                    onUpdate={(property, value) => onUpdateFieldProperty(activeField.id, property, value)}
                />
            ) : (
                <section>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">How it works</p>
                    <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
                        <div className="flex gap-3">
                            <UploadCloud className="size-4 text-slate-400" />
                            <span>Upload your PDF from the toolbar above.</span>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="ghost" size="icon-sm" className="h-4 w-4 p-0 hover:bg-transparent">
                                <Plus className="size-4 text-slate-400" />
                            </Button>
                            <span>Drag any text field to the right spot.</span>
                        </div>
                        <div className="flex gap-3">
                            <Download className="size-4 text-slate-400" />
                            <span>Export a flattened PDF when you’re done.</span>
                        </div>
                    </div>
                </section>
            )}
        </aside>
    )
}
