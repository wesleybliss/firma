import { Button } from "@/components/ui/button"
import { User, Hash, Mail, Phone, Building, Type, Calendar } from 'lucide-react'

const AddFieldButton = ({
    onClick,
    icon,
    label
}: {
    onClick: () => void
    icon: React.ReactNode
    label: string
}) => (
    <Button
        variant="ghost"
        size="sm"
        className="justify-start"
        onClick={onClick}
    >
        {icon}
        <span className="text-xs">{label}</span>
    </Button>
)

const FieldsSection = ({
    onAddTextField
}: {
    onAddTextField: (type: 'text' | 'date' | 'fullName' | 'initials' | 'email' | 'phone' | 'company') => void
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
                        icon={<Type className="size-3" />}
                        label="Text"
                    />
                    <AddFieldButton
                        onClick={() => onAddTextField('date')}
                        icon={<Calendar className="size-3" />}
                        label="Date"
                    />
                    <AddFieldButton
                        onClick={() => onAddTextField('fullName')}
                        icon={<User className="size-3" />}
                        label="Name"
                    />
                    <AddFieldButton
                        onClick={() => onAddTextField('initials')}
                        icon={<Hash className="size-3" />}
                        label="Initials"
                    />
                    <AddFieldButton
                        onClick={() => onAddTextField('email')}
                        icon={<Mail className="size-3" />}
                        label="Email"
                    />
                    <AddFieldButton
                        onClick={() => onAddTextField('phone')}
                        icon={<Phone className="size-3" />}
                        label="Phone"
                    />
                    <AddFieldButton
                        onClick={() => onAddTextField('company')}
                        icon={<Building className="size-3" />}
                        label="Company"
                    />
                </div>

                <div className="grid grid-cols-2 gap-1">
                    {/* @todo: AddFieldButton for checkbox, radio, and "x" mark */}
                </div>

            </div>

        </section>
    )
}

export default FieldsSection
