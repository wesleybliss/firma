import { memo } from 'react'
import { Signature } from '@/types'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

type SignatureImageProps = {
    signature: Signature
    onPlaceSignature: (id: string) => void
    removeSignature: (id: string) => void
}

const SignatureImage = ({ signature, onPlaceSignature, removeSignature }: SignatureImageProps) => {
    return (
        <div
            key={signature.id}
            className="group relative flex cursor-pointer items-center justify-center
                rounded-lg border border-slate-200 bg-white p-2 transition-all hover:border-sky-500 hover:shadow-sm"
            onClick={() => onPlaceSignature(signature.id)}>
            <img src={signature.dataUrl} alt="Signature" className="h-8 max-w-full object-contain bg-white" />
            <Button
                variant="ghost"
                size="icon-sm"
                className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={e => {
                    e.stopPropagation()
                    removeSignature(signature.id)
                }}>
                <Trash2 className="size-3 text-red-500" />
            </Button>
        </div>
    )
}

export default memo(SignatureImage)
