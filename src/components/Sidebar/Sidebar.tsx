import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TextProperties } from '@/components/TextProperties'
import { SignatureManager } from '@/components/SignatureManager'
import { TextField, FieldType } from '@/types'
import { cn } from '@/lib/utils'
import OverviewSection from './OverviewSection'
import FieldsSection from './FieldsSection'

interface SidebarProps {
    fileName: string | null
    textFields: TextField[]
    activeFieldId: string | null
    onAddTextField: (fieldType?: FieldType) => void
    onUpdateFieldProperty: (id: string, property: keyof TextField, value: any) => void
    onPlaceSignature: (id: string) => void
}

const Sidebar = ({
    fileName,
    textFields,
    activeFieldId,
    onAddTextField,
    onUpdateFieldProperty,
    onPlaceSignature,
}: SidebarProps) => {
    const activeField = textFields.find(f => f.id === activeFieldId)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const toggleCollapsed = () => setIsCollapsed(prev => !prev)

    return (
        <aside
            className={cn(
                'relative hidden border-r border-slate-200 bg-white/70 dark:bg-slate-800/70 py-6',
                'transition-[width] duration-300 ease-in-out md:flex md:flex-col',
                isCollapsed ? 'w-10 px-2' : 'w-72 px-6'
            )}
        >
            <button
                type="button"
                onClick={toggleCollapsed}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="absolute right-0 top-1/2 flex h-8 w-8 translate-x-1/2 -translate-y-1/2
                    items-center justify-center rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800
                    text-slate-600 dark:text-slate-400 shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 focus-visible:outline
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 z-10"
            >
                {isCollapsed
                    ? <ChevronRight className="size-4" />
                    : <ChevronLeft className="size-4" />}
            </button>

            <div
                className={cn(
                    'flex flex-1 flex-col gap-8 overflow-y-auto transition-opacity duration-200',
                    isCollapsed && 'pointer-events-none opacity-0'
                )}
            >
                <OverviewSection
                    fileName={fileName}
                    textFields={textFields}
                />
                <FieldsSection
                    onAddTextField={onAddTextField}
                />
                <SignatureManager
                    onPlaceSignature={onPlaceSignature}
                />

                {/* @todo: move this to the right side, above the inspector */}
                {activeField && (
                    <TextProperties
                        field={activeField}
                        onUpdate={(property, value) => onUpdateFieldProperty(
                            activeField.id, property, value)}
                    />
                )}
            </div>
        </aside>
    )
}

export default Sidebar