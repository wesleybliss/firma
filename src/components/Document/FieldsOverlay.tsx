import { PanelsTopLeft, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TextField as TextFieldComponent } from '@/components/TextField'
import { TextField as TextFieldType, SignatureField } from '@/types'
import { Rnd } from 'react-rnd'

type FieldsOverlayProps = {
    textFields: TextFieldType[]
    signatureFields: SignatureField[]
    currentPage: number
    scale: number
    scaledWidth: number
    scaledHeight: number
    activeFieldId: string | null
    onFieldClick: (fieldId: string) => void
    onFieldUpdate: (fieldId: string, updatedField: TextFieldType) => void
    onFieldRemove: (fieldId: string) => void
    onFieldPositionUpdate: (fieldId: string, position: { x: number; y: number }) => void
    onFieldDimensionsUpdate: (fieldId: string, dimensions: { width: number; height: number }) => void
    onSignatureRemove: (fieldId: string) => void
    onSignaturePositionUpdate: (fieldId: string, position: { x: number; y: number }) => void
    onSignatureDimensionsUpdate: (fieldId: string, dimensions: { width: number; height: number }) => void
}

const FieldsOverlay = ({
    textFields,
    signatureFields,
    currentPage,
    scale,
    scaledWidth,
    scaledHeight,
    activeFieldId,
    onFieldClick,
    onFieldUpdate,
    onFieldRemove,
    onFieldPositionUpdate,
    onFieldDimensionsUpdate,
    onSignatureRemove,
    onSignaturePositionUpdate,
    onSignatureDimensionsUpdate,
}: FieldsOverlayProps) => {

    return (<>

        <div
            className="pointer-events-none absolute left-0 top-0"
            style={{
                width: scaledWidth,
                height: scaledHeight,
            }}
        >
            {textFields
                .filter(field => field.page === currentPage)
                .map(field => (
                    <TextFieldComponent
                        key={`${field.id}-${scale}`}
                        field={field}
                        scale={scale}
                        scaledWidth={scaledWidth}
                        scaledHeight={scaledHeight}
                        isActive={activeFieldId === field.id}
                        onFieldClick={onFieldClick}
                        onFieldUpdate={onFieldUpdate}
                        onFieldRemove={onFieldRemove}
                        onFieldPositionUpdate={onFieldPositionUpdate}
                        onFieldDimensionsUpdate={onFieldDimensionsUpdate}
                    />
                ))}
        </div>

        <div
            className="pointer-events-none absolute left-0 top-0"
            style={{
                width: scaledWidth,
                height: scaledHeight,
            }}
        >
            {signatureFields.filter(f => f.page === currentPage).map(field => {
                const isActive = activeFieldId === field.id
                const showChrome = isActive || field.isNew

                return (
                    <Rnd
                        key={`${field.id}-${scale}`}
                        position={{
                            x: field.x * scaledWidth,
                            y: field.y * scaledHeight,
                        }}
                        size={{
                            width: field.width * scale,
                            height: field.height * scale,
                        }}
                        onDragStop={(_e, d) => {
                            onSignaturePositionUpdate(field.id, { x: d.x, y: d.y })
                        }}
                        onResizeStop={(_e, _direction, ref, _delta, position) => {
                            onSignatureDimensionsUpdate(field.id, {
                                width: parseInt(ref.style.width) / scale,
                                height: parseInt(ref.style.height) / scale,
                            })
                            onSignaturePositionUpdate(field.id, position)
                        }}
                        bounds="parent"
                        dragHandleClassName="drag-handle"
                        enableResizing={showChrome}
                        disableDragging={!showChrome}
                        lockAspectRatio={true}
                        className={cn(
                            'pointer-events-auto',
                            showChrome && '!cursor-auto'
                        )}
                    >
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                onFieldClick(field.id)
                            }}
                            className={cn(
                                'relative h-full w-full rounded p-1 transition-colors',
                                showChrome
                                    ? 'z-50 border border-sky-500 bg-white/10 shadow-sm ring-1 ring-sky-500'
                                    : 'z-10 border border-transparent hover:border-slate-300 hover:bg-white/10'
                            )}
                        >
                            <div className={cn("drag-handle absolute -left-3 -top-3 cursor-grab p-1",
                                "text-slate-400 hover:text-slate-600 active:cursor-grabbing",
                                !showChrome && "opacity-0 group-hover:opacity-100")}>
                                <div className="rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
                                    <PanelsTopLeft className="size-3" />
                                </div>
                            </div>

                            <img
                                src={field.dataUrl}
                                alt="Signature"
                                className="h-full w-full object-contain"
                                draggable={false}
                            />

                            {showChrome && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSignatureRemove(field.id);
                                    }}
                                    className="absolute -right-3 -top-3 rounded-full bg-white p-1 text-slate-400
                                        shadow-sm ring-1 ring-slate-200 hover:bg-red-50 hover:text-red-500"
                                >
                                    <Trash2 className="size-3" />
                                </button>
                            )}
                        </div>
                    </Rnd>
                )
            })}
        </div>

    </>)

}

export default FieldsOverlay
