import { APP_NAME } from '@/lib/constants'
import { useEffect, useState } from 'react'
import { ThemeProviderContext } from '@/components/ThemeProviderContext'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

export function ThemeProvider({
    children,
    defaultTheme = 'system',
    storageKey = `${APP_NAME.toLowerCase()}-theme`,
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
    )

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove('light', 'dark')

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const applySystemTheme = (isDark: boolean) => {
                root.classList.remove('light', 'dark')
                root.classList.add(isDark ? 'dark' : 'light')
            }

            // Apply current system theme immediately
            applySystemTheme(mediaQuery.matches)

            // React to subsequent system changes
            const handleChange = (e: MediaQueryListEvent) => applySystemTheme(e.matches)
            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        }

        root.classList.add(theme)
    }, [theme])

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}