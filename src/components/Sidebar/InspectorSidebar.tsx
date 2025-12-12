import { useState } from 'react'
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, getFieldLabel } from '@/lib/utils'
import { useCanvasStore } from '@/store/canvas'

const InspectorSidebar = () => {
    const {
        textFields,
        activeFieldId,
        removeTextField,
        updateTextField,
        setActiveFieldId,
    } = useCanvasStore()

    const [isCollapsed, setIsCollapsed] = useState(false)
    const toggleCollapsed = () => setIsCollapsed(prev => !prev)

    return (
        <aside
            className={cn(
                'relative hidden border-l border-slate-200 bg-white/70 dark:bg-slate-800/70 py-6 transition-[width]',
                'duration-300 ease-in-out lg:flex lg:flex-col',
                isCollapsed ? 'w-10 px-2' : 'w-80 px-6',
            )}>
            <button
                type="button"
                onClick={toggleCollapsed}
                aria-label={isCollapsed ? 'Expand inspector' : 'Collapse inspector'}
                className="absolute left-0 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center
                    justify-center rounded-full border border-slate-200 bg-white dark:border-slate-700
                    dark:bg-slate-800 text-slate-600 shadow-sm transition-colors hover:bg-slate-50
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                    focus-visible:outline-slate-400">
                {isCollapsed ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
            </button>

            <div
                className={cn(
                    'flex flex-1 flex-col transition-opacity duration-200',
                    isCollapsed && 'pointer-events-none opacity-0',
                )}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]
                    text-slate-500 dark:text-slate-400">Inspector</p>
                <div className="mt-4 flex-1 space-y-4 overflow-y-auto rounded-2xl border border-slate-200
                    bg-white dark:border-slate-700 dark:bg-slate-800 p-4 shadow-sm transition-opacity duration-200">
                    {textFields.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center
                            gap-2 text-center text-sm text-slate-500 dark:text-slate-400">
                            <div className="size-6 text-slate-300">
                                <FileText className="size-6" />
                            </div>
                            Add a text field to see it here.
                        </div>
                    ) : (
                        textFields.map((field, index) => {
                            const isActive = activeFieldId === field.id
                            return (
                                <div
                                    key={field.id}
                                    className={cn('rounded-xl border p-4 transition-colors', {
                                        'border-sky-500 bg-sky-50/70': isActive,
                                        'border-slate-200 bg-white hover:border-slate-300': !isActive,
                                    })}>
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Field {index + 1}
                                            </p>
                                            <span className="rounded bg-sky-100 px-1.5 py-0.5
                                                text-[10px] font-medium text-sky-700">
                                                {getFieldLabel(field.fieldType)}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => removeTextField(field.id)}>
                                            <div className="size-4 text-slate-400">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-trash-2">
                                                    <path d="M3 6h18" />
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                    <line x1="10" x2="10" y1="11" y2="17" />
                                                    <line x1="14" x2="14" y1="11" y2="17" />
                                                </svg>
                                            </div>
                                        </Button>
                                    </div>
                                    <input
                                        value={field.text}
                                        onChange={event => updateTextField(field.id, event.target.value)}
                                        onFocus={() => setActiveFieldId(field.id)}
                                        placeholder="Enter text"
                                        className="w-full rounded-md border border-slate-200
                                            px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"/>
                                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                                        <span>X: {(field.x * 100).toFixed(0)}%</span>
                                        <span>Y: {(field.y * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </aside>
    )

}

export default InspectorSidebar
