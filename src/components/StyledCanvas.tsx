import { forwardRef, useEffect } from 'react'
// import useNightModeDetection from '@/hooks/useNightModeDetection'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const AUTO_FILL_WHITE_CANVAS_ENABLED = false

type StyledCanvasProps = { className?: string; width: number; height: number } & React.CanvasHTMLAttributes<HTMLCanvasElement>;

const StyledCanvas = forwardRef<HTMLCanvasElement, StyledCanvasProps>(({
    className,
    width,
    height,
    ...props
}, ref) => {
    // const { isDarkModeForced, hasInvertedColors } = useNightModeDetection()
    // const isDarkMode = isDarkModeForced || hasInvertedColors

    useEffect(() => {

        if (!AUTO_FILL_WHITE_CANVAS_ENABLED) return

        const canvas = ref?.current
        if (!canvas) {
            toast.error('Canvas not found')
            return
        }

        const ctx = canvas.getContext('2d')
        if (!ctx) {
            toast.error('Canvas context not found')
            return
        }

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        toast.info('Painted canvas')
    }, [ref])

    return (
        <canvas
            ref={ref}
            className={cn('cursor-crosshair touch-none rounded bg-transparent', className)}
            width={width}
            height={height}
            {...props} />
    )
})

export default StyledCanvas
