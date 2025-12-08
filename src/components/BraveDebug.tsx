import { useRef, useState, useEffect } from 'react'
import StyledCanvas from './StyledCanvas'

const BraveDebug = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [data, setData] = useState()

    useEffect(() => {

        const isDarkModeForced = window.matchMedia('(prefers-color-scheme: dark)').matches

        // Or check for inverted colors specifically
        const hasInvertedColors = window.matchMedia('(inverted-colors: inverted)').matches

        setData({
            isDarkModeForced,
            hasInvertedColors,
        })

    }, [])
    return (
        <div className="border-4 border-red-200 p-4">
            <h1>Brave Debug</h1>
            <div>
                <StyledCanvas
                    className=""
                    width={600}
                    height={300}
                    ref={canvasRef} />
            </div>
            <div><pre><code className="bg-white text-black">
                {JSON.stringify(data, null, 2)}
            </code></pre></div>
        </div>
    )
}

export default BraveDebug
