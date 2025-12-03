import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createStoreName } from '@/store/store'

export type DefaultsState = {
    fontFamily: string
    fontSize: number
    setFontFamily: (fontFamily: string) => void
    setFontSize: (fontSize: number) => void
    resetDefaults: () => void
}

const DEFAULT_SETTINGS = {
    fontFamily: 'Inter',
    fontSize: 12,
}

export const useDefaultsStore = create<DefaultsState>()(
    persist(
        (set) => ({
            ...DEFAULT_SETTINGS,
            setFontFamily: (fontFamily: string) => set({ fontFamily }),
            setFontSize: (fontSize: number) => set({ fontSize }),
            resetDefaults: () => set(DEFAULT_SETTINGS),
        }),
        {
            name: createStoreName('defaults'),
            storage: createJSONStorage(() => localStorage),
        }
    )
)