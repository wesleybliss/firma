import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createStoreName } from '@/store/store'

type UserStore = {
    name: string
    setName: (name: string) => void
    initials: string
    setInitials: (initials: string) => void
    email: string
    setEmail: (email: string) => void
    phone: string
    setPhone: (phone: string) => void
    company: string
    setCompany: (company: string) => void
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            name: '',
            setName: (name: string) => set({ name }),
            initials: '',
            setInitials: (initials: string) => set({ initials }),
            email: '',
            setEmail: (email: string) => set({ email }),
            phone: '',
            setPhone: (phone: string) => set({ phone }),
            company: '',
            setCompany: (company: string) => set({ company }),
        }),
        {
            name: createStoreName('user'), // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)
