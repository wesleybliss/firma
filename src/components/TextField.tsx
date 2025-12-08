import { Rnd } from 'react-rnd'
import { PanelsTopLeft, Trash2, User, Hash, Mail, Phone, Building, Calendar } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { TextField as TextFieldType, FieldType } from '@/types'

interface TextFieldProps {
    field: TextFieldType
    scale: number
    scaledWidth: number
    scaledHeight: number
    isActive: boolean
    onFieldClick: (id: string) => void
    onFieldUpdate: (id: string, text: string) => void
    onFieldRemove: (id: string) => void
    onFieldPositionUpdate: (id: string, position: { x: number; y: number }) => void
    onFieldDimensionsUpdate: (id: string, dimensions: { width: number; height: number }) => void
}

export function TextField({
    field,
    scale,
    scaledWidth,
    scaledHeight,
    isActive,
    onFieldClick,
    onFieldUpdate,
    onFieldRemove,
    onFieldPositionUpdate,
    onFieldDimensionsUpdate,
}: TextFieldProps) {
    const showChrome = isActive || field.isNew
    const isCompact = ['checkbox', 'radio', 'x'].includes(field.fieldType)

    const getFieldIcon = (fieldType: FieldType) => {
        switch (fieldType) {
            case 'date':
                return <Calendar className="size-3" />
            case 'fullName':
                return <User className="size-3" />
            case 'initials':
                return <Hash className="size-3" />
            case 'email':
                return <Mail className="size-3" />
            case 'phone':
                return <Phone className="size-3" />
            case 'company':
                return <Building className="size-3" />
            default:
                return null
        }
    }

    const getFieldLabel = (fieldType: FieldType) => {
        switch (fieldType) {
            case 'text':
                return 'Text'
            case 'date':
                return 'Date'
            case 'fullName':
                return 'Full Name'
            case 'initials':
                return 'Initials'
            case 'email':
                return 'Email'
            case 'phone':
                return 'Phone'
            case 'company':
                return 'Company'
            case 'checkbox':
                return 'Checkbox'
            case 'radio':
                return 'Radio'
            case 'x':
                return 'X-Mark'
            default:
                return null
        }
    }

    const fontStyles = {
        fontFamily: field.fontFamily,
        fontSize: `${field.fontSize * scale}px`,
        fontWeight: field.isBold ? 'bold' : 'normal',
        fontStyle: field.isItalic ? 'italic' : 'normal',
    }

    return (
        <Rnd
            position={{
                x: field.x * scaledWidth,
                y: field.y * scaledHeight,
            }}
            size={isCompact ? {
                width: field.width * scale,
                height: field.height * scale,
            } : undefined}
            onDragStop={(_event, data) => {
                onFieldPositionUpdate(field.id, { x: data.x, y: data.y })
            }}
            onResizeStop={(_event, _direction, ref, _delta, position) => {
                onFieldDimensionsUpdate(field.id, {
                    width: parseInt(ref.style.width) / scale,
                    height: parseInt(ref.style.height) / scale,
                })
                onFieldPositionUpdate(field.id, position)
            }}
            bounds="parent"
            dragHandleClassName="drag-handle"
            enableResizing={false}
            disableDragging={!showChrome}
            className={cn('pointer-events-auto !border-none !outline-none', showChrome && '!cursor-auto')}
            style={{ border: 'none' }}
        >
            {showChrome && field.fieldType && (
                <div className="drag-handle cursor-grab active:cursor-grabbing absolute left-0
                    -top-5 flex items-center gap-1 rounded bg-sky-100
                    px-1.5 py-0.5 text-[10px] font-medium text-sky-700"
                    style={{ whiteSpace: 'nowrap' }}>
                    {getFieldIcon(field.fieldType)}
                    <span>{getFieldLabel(field.fieldType)}</span>
                </div>
            )}
            <div
                onClick={event => {
                    event.stopPropagation()
                    onFieldClick(field.id)
                }}
                className={cn(
                    'flex h-full w-full items-center gap-1 rounded p-1 transition-colors',
                    showChrome
                        ? 'z-50 border border-sky-500 bg-white/40 shadow-sm ring-1 ring-sky-500'
                        : 'z-10 border border-transparent hover:border-slate-300 hover:bg-white/50'
                )}
            >
                <div
                    className={cn(
                        'drag-handle cursor-grab p-0.5 text-slate-400',
                        'hover:text-slate-600 active:cursor-grabbing',
                        !showChrome && 'opacity-0 group-hover:opacity-100'
                    )}
                >
                    <PanelsTopLeft className="size-3" />
                </div>

                {/* CSS Grid container for auto-sizing */}
                <div className="relative grid flex-1">
                    {/* Hidden span to dictate width */}
                    <span
                        className="invisible col-start-1 row-start-1 whitespace-pre px-0.5"
                        style={fontStyles}
                    >
                        {field.text || (isCompact ? ' ' : 'Type here...')}
                    </span>

                    {/* Input overlay */}
                    <input
                        id={`field-${field.id}`}
                        value={field.text}
                        onFocus={() => onFieldClick(field.id)}
                        onClick={() => onFieldClick(field.id)}
                        onChange={event => onFieldUpdate(field.id, event.target.value)}
                        className={cn("absolute inset-0 h-full w-full border-0 bg-transparent p-0 text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none",
                            isCompact ? "text-center cursor-default" : "px-0.5"
                        )}
                        placeholder={isCompact ? "" : "Type here..."}
                        style={{
                            ...fontStyles,
                            color: field.color,
                            textDecoration: [
                                field.isUnderline ? 'underline' : '',
                                field.isStrikethrough ? 'line-through' : '',
                            ]
                                .filter(Boolean)
                                .join(' '),
                        }}
                    />
                </div>

                {showChrome && (
                    <button
                        onClick={event => {
                            event.stopPropagation()
                            onFieldRemove(field.id)
                        }}
                        className={cn("rounded-full p-1 text-slate-400 hover:text-red-500",
                            isCompact && "absolute -right-3 -top-3 bg-white shadow-sm ring-1 ring-slate-200"
                        )}
                    >
                        <Trash2 className="size-3" />
                    </button>
                )}
            </div>
        </Rnd>
    )
}

export default TextField