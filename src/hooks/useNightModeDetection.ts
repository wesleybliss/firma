import { useState, useEffect } from 'react'

const useNightModeDetection = () => {
    const [isDarkModeForced, setIsDarkModeForced] = useState(false)
    const [hasInvertedColors, setHasInvertedColors] = useState(false)

    useEffect(() => {

        setIsDarkModeForced(window.matchMedia('(prefers-color-scheme: dark)').matches)

        // Also check for inverted colors specifically
        setHasInvertedColors(window.matchMedia('(inverted-colors: inverted)').matches)
    }, [])

    return {
        isDarkModeForced,
        hasInvertedColors,
    }
}

export default useNightModeDetection