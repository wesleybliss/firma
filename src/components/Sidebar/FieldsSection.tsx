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

type onAddTextFieldTypeArg = 'text' | 'date' | 'fullName' | 'initials'
    | 'email' | 'phone' | 'company' | 'checkbox' | 'radio' | 'x'

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

const FieldsSection = ({
    onAddTextField,
}: {
    onAddTextField: (type: onAddTextFieldTypeArg) => void
}) => {
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
                        onClick={() => onAddTextField('text')}
                        icon={<Type className="size-4" />}
                        label="Text" />
                    <AddFieldButton
                        onClick={() => onAddTextField('date')}
                        icon={<Calendar className="size-4" />}
                        label="Date" />
                    <AddFieldButton
                        onClick={() => onAddTextField('fullName')}
                        icon={<User className="size-4" />}
                        label="Name" />
                    <AddFieldButton
                        onClick={() => onAddTextField('initials')}
                        icon={<Hash className="size-4" />}
                        label="Initials" />
                    <AddFieldButton
                        onClick={() => onAddTextField('email')}
                        icon={<Mail className="size-4" />}
                        label="Email" />
                    <AddFieldButton
                        onClick={() => onAddTextField('phone')}
                        icon={<Phone className="size-4" />}
                        label="Phone" />
                    <AddFieldButton
                        onClick={() => onAddTextField('company')}
                        icon={<Building className="size-4" />}
                        label="Company" />
                </div>

                <hr className="w-full border-t border-gray-200 my-2" />

                <div className="grid grid-cols-2 gap-1">
                    <AddFieldButton
                        onClick={() => onAddTextField('checkbox')}
                        icon={<SquareCheckBig className="size-4" />}
                        label="Checkbox" />
                    <AddFieldButton
                        onClick={() => onAddTextField('radio')}
                        icon={<CircleDot className="size-4" />}
                        label="Radio" />
                    <AddFieldButton
                        onClick={() => onAddTextField('x')}
                        icon={<X className="size-4" />}
                        label="X Mark" />
                </div>

            </div>

        </section>
    )
}

export default FieldsSection
