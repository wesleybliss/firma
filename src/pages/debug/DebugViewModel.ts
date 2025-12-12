import { useRef, useState, useEffect } from 'react'

type Data = {
    isDarkModeForced: boolean
    hasInvertedColors: boolean
}

const DebugViewModel = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [data, setData] = useState<Data>()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    useEffect(() => {

        const isDarkModeForced = window.matchMedia('(prefers-color-scheme: dark)').matches

        // Or check for inverted colors specifically
        const hasInvertedColors = window.matchMedia('(inverted-colors: inverted)').matches

        setData({
            isDarkModeForced,
            hasInvertedColors,
        })

    }, [])

    return {
        canvasRef,
        data,
        setData,
        isDialogOpen,
        setIsDialogOpen,
    }
}

export default DebugViewModel
