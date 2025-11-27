import { ReactNode } from 'react'

interface FeatureCardProps {
    icon: ReactNode
    title: string
    description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur transition-all hover:shadow-md">
            <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-slate-100">
                {icon}
            </div>
            <h3 className="mb-2 font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
    )
}
