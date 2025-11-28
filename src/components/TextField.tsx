import React from 'react'
import { Rnd } from 'react-rnd'
import { PanelsTopLeft, Trash2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { TextField as TextFieldType } from '@/types'

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

    return (
        <Rnd
            position={{
                x: field.x * scaledWidth,
                y: field.y * scaledHeight,
            }}
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
            <div
                onClick={event => {
                    event.stopPropagation()
                    onFieldClick(field.id)
                }}
                className={cn(
                    'flex h-full w-full items-center gap-1 rounded p-1 transition-colors',
                    showChrome
                        ? 'z-50 border border-sky-500 bg-white shadow-sm ring-1 ring-sky-500'
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
                <input
                    id={`field-${field.id}`}
                    value={field.text}
                    onFocus={() => onFieldClick(field.id)}
                    onClick={() => onFieldClick(field.id)}
                    onChange={event => onFieldUpdate(field.id, event.target.value)}
                    className="h-full flex-1 border-0 bg-transparent p-0 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none"
                    placeholder="Type here..."
                    style={{
                        width: `${Math.max(field.text.length, 10)}ch`,
                        fontFamily: field.fontFamily,
                        fontSize: `${field.fontSize}px`,
                        color: field.color,
                        fontWeight: field.isBold ? 'bold' : 'normal',
                        fontStyle: field.isItalic ? 'italic' : 'normal',
                        textDecoration: [
                            field.isUnderline ? 'underline' : '',
                            field.isStrikethrough ? 'line-through' : '',
                        ]
                            .filter(Boolean)
                            .join(' '),
                    }}
                />
                {showChrome && (
                    <button
                        onClick={event => {
                            event.stopPropagation()
                            onFieldRemove(field.id)
                        }}
                        className="rounded-full p-1 text-slate-400 hover:text-red-500"
                    >
                        <Trash2 className="size-3" />
                    </button>
                )}
            </div>
        </Rnd>
    )
}

export default TextField