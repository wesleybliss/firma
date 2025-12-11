import { Button } from '@/components/ui/button'
import {
    User,
    Hash,
    Mail,
    Phone,
    Building,
    Type,
    Calendar,
    SquareCheckBig,
    CircleDot,
    X,
} from 'lucide-react'
import { useCanvasStore } from '@/store/canvas'

const AddFieldButton = ({
    onClick,
    icon,
    label,
}: {
    onClick: () => void
    icon: React.ReactNode
    label: string
}) => (
    <Button
        variant="ghost"
        size="sm"
        className="justify-start"
        onClick={onClick}>
        {icon}
        <span className="text-sm">{label}</span>
    </Button>
)

const FieldsSection = () => {
    const addTextField = useCanvasStore(state => state.addTextField)

    return (
        <section>

            <div className="space-y-1">

                <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Fields
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-1">
                    <AddFieldButton
                        onClick={() => addTextField('text')}
                        icon={<Type className="size-4" />}
                        label="Text" />
                    <AddFieldButton
                        onClick={() => addTextField('date')}
                        icon={<Calendar className="size-4" />}
                        label="Date" />
                    <AddFieldButton
                        onClick={() => addTextField('fullName')}
                        icon={<User className="size-4" />}
                        label="Name" />
                    <AddFieldButton
                        onClick={() => addTextField('initials')}
                        icon={<Hash className="size-4" />}
                        label="Initials" />
                    <AddFieldButton
                        onClick={() => addTextField('email')}
                        icon={<Mail className="size-4" />}
                        label="Email" />
                    <AddFieldButton
                        onClick={() => addTextField('phone')}
                        icon={<Phone className="size-4" />}
                        label="Phone" />
                    <AddFieldButton
                        onClick={() => addTextField('company')}
                        icon={<Building className="size-4" />}
                        label="Company" />
                </div>

                <hr className="w-full border-t border-gray-200 my-2" />

                <div className="grid grid-cols-2 gap-1">
                    <AddFieldButton
                        onClick={() => addTextField('checkbox')}
                        icon={<SquareCheckBig className="size-4" />}
                        label="Checkbox" />
                    <AddFieldButton
                        onClick={() => addTextField('radio')}
                        icon={<CircleDot className="size-4" />}
                        label="Radio" />
                    <AddFieldButton
                        onClick={() => addTextField('x')}
                        icon={<X className="size-4" />}
                        label="X Mark" />
                </div>

            </div>

        </section>
    )
}

export default FieldsSection
