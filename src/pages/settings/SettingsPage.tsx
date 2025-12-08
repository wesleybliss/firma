
import { Link } from 'react-router-dom'
import { ChevronLeft, Trash2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AddSignatureDialog } from '@/components/AddSignatureDialog'
import { useUserStore } from '@/store/user'
import { useSignaturesStore } from '@/store/signatures'
import { useDefaultsStore } from '@/store/defaults'
import { GOOGLE_FONTS } from '@/lib/fonts'
import { DATE_FORMATS } from '@/lib/dateUtils'

const SettingsPage = () => {
    const userStore = useUserStore()
    const { signatures, removeSignature } = useSignaturesStore()
    const { fontFamily, fontSize, dateFormat, setFontFamily, setFontSize, setDateFormat } = useDefaultsStore()

    return (
        <div className="container mx-auto max-w-2xl px-4 py-8">
            <div className="mb-8 flex items-center gap-4">
                <Link to="/" className={buttonVariants({ variant: "ghost", size: "icon" })}>
                    <ChevronLeft className="size-5" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
            </div>

            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Profile Information</h2>
                    <div className="grid gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 shadow-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={userStore.name}
                                    onChange={(e) => userStore.setName(e.target.value)}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="initials">Initials</Label>
                                <Input
                                    id="initials"
                                    value={userStore.initials}
                                    onChange={(e) => userStore.setInitials(e.target.value)}
                                    placeholder="JD"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={userStore.phone}
                                    onChange={(e) => userStore.setPhone(e.target.value)}
                                    placeholder="(555) 000-0000"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="date-format">Date Format</Label>
                                <select
                                    id="date-format"
                                    value={dateFormat}
                                    onChange={(e) => setDateFormat(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {DATE_FORMATS.map((format) => (
                                        <option key={format.value} value={format.value}>
                                            {format.label} ({format.value})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={userStore.email}
                                    onChange={(e) => userStore.setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="company">Company</Label>
                                <Input
                                    id="company"
                                    value={userStore.company}
                                    onChange={(e) => userStore.setCompany(e.target.value)}
                                    placeholder="Acme Inc."
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Default Font Settings
                    </h2>
                    <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 shadow-sm">
                        <div className="grid gap-2">
                            <Label htmlFor="font-family">Font Family</Label>
                            <select
                                id="font-family"
                                value={fontFamily}
                                onChange={(e) => setFontFamily(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {GOOGLE_FONTS.map((font) => (
                                    <option key={font.family} value={font.family}>
                                        {font.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="font-size">Font Size</Label>
                            <Input
                                id="font-size"
                                type="number"
                                min="8"
                                max="72"
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Signatures
                        </h2>
                        <AddSignatureDialog />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {signatures.length === 0 ? (
                            <div className="col-span-full rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
                                No signatures saved yet
                            </div>
                        ) : (
                            signatures.map(signature => (
                                <div
                                    key={signature.id}
                                    className="group relative flex h-32 items-center justify-center rounded-xl border border-slate-200 bg-white dark:bg-white p-4 transition-all hover:border-sky-500 hover:shadow-sm"
                                >
                                    <img src={signature.dataUrl} alt="Signature" className="max-h-full max-w-full object-contain" />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                                        onClick={() => removeSignature(signature.id)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default SettingsPage
