import { Bold, Italic, Strikethrough, Underline } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GOOGLE_FONTS } from '@/lib/fonts'
import { TextField } from '@/types'

interface TextPropertiesProps {
    field: TextField
    onUpdate: (property: keyof TextField, value: any) => void
}

export function TextProperties({ field, onUpdate }: TextPropertiesProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500">Font Family</p>
                <select
                    value={field.fontFamily}
                    onChange={(e) => onUpdate('fontFamily', e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                >
                    {GOOGLE_FONTS.map(font => (
                        <option key={font.name} value={font.family} style={{ fontFamily: font.family }}>
                            {font.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-500">Size</p>
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            value={field.fontSize}
                            onChange={(e) => onUpdate('fontSize', Number(e.target.value))}
                            className="h-9"
                            min={8}
                            max={72}
                        />
                        <span className="text-xs text-slate-400">px</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-500">Color</p>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                type="color"
                                value={field.color}
                                onChange={(e) => onUpdate('color', e.target.value)}
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            />
                            <div
                                className="flex h-9 w-full items-center gap-2 rounded-md border border-slate-200 bg-white px-2"
                                style={{ color: field.color }}
                            >
                                <div className="size-4 rounded-full border border-slate-200" style={{ backgroundColor: field.color }} />
                                <span className="text-xs font-medium uppercase text-slate-600">{field.color}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500">Style</p>
                <div className="grid grid-cols-4 gap-1 rounded-lg border border-slate-200 bg-white p-1">
                    <Button
                        variant={field.isBold ? 'secondary' : 'ghost'}
                        size="icon-sm"
                        className="h-8 w-full rounded-md"
                        onClick={() => onUpdate('isBold', !field.isBold)}
                    >
                        <Bold className="size-4" />
                    </Button>
                    <Button
                        variant={field.isItalic ? 'secondary' : 'ghost'}
                        size="icon-sm"
                        className="h-8 w-full rounded-md"
                        onClick={() => onUpdate('isItalic', !field.isItalic)}
                    >
                        <Italic className="size-4" />
                    </Button>
                    <Button
                        variant={field.isUnderline ? 'secondary' : 'ghost'}
                        size="icon-sm"
                        className="h-8 w-full rounded-md"
                        onClick={() => onUpdate('isUnderline', !field.isUnderline)}
                    >
                        <Underline className="size-4" />
                    </Button>
                    <Button
                        variant={field.isStrikethrough ? 'secondary' : 'ghost'}
                        size="icon-sm"
                        className="h-8 w-full rounded-md"
                        onClick={() => onUpdate('isStrikethrough', !field.isStrikethrough)}
                    >
                        <Strikethrough className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
