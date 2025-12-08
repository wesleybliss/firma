import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createStoreName } from '@/store/store'

export type DefaultsState = {
    fontFamily: string
    fontSize: number
    dateFormat: string
    setFontFamily: (fontFamily: string) => void
    setFontSize: (fontSize: number) => void
    setDateFormat: (dateFormat: string) => void
    resetDefaults: () => void
}

const DEFAULT_SETTINGS = {
    fontFamily: 'Inter',
    fontSize: 12,
    dateFormat: 'MM/DD/YYYY',
}

export const useDefaultsStore = create<DefaultsState>()(
    persist(
        (set) => ({
            ...DEFAULT_SETTINGS,
            setFontFamily: (fontFamily: string) => set({ fontFamily }),
            setFontSize: (fontSize: number) => set({ fontSize }),
            setDateFormat: (dateFormat: string) => set({ dateFormat }),
            resetDefaults: () => set(DEFAULT_SETTINGS),
        }),
        {
            name: createStoreName('defaults'),
            storage: createJSONStorage(() => localStorage),
        }
    )
)