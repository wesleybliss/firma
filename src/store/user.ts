import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createStoreName } from '@/store/store'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuthStore } from './auth'

type UserData = {
    name: string
    initials: string
    email: string
    phone: string
    company: string
    address: string
}

type UserStore = UserData & {
    setName: (name: string) => void
    setInitials: (initials: string) => void
    setEmail: (email: string) => void
    setPhone: (phone: string) => void
    setCompany: (company: string) => void
    setAddress: (address: string) => void
    syncWithFirestore: (userId: string) => () => void
    saveToFirestore: (userId: string) => Promise<void>
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            name: '',
            setName: (name: string) => {
                set({ name })
                const user = useAuthStore.getState().user
                if (user) {
                    get().saveToFirestore(user.uid)
                }
            },
            initials: '',
            setInitials: (initials: string) => {
                set({ initials })
                const user = useAuthStore.getState().user
                if (user) {
                    get().saveToFirestore(user.uid)
                }
            },
            email: '',
            setEmail: (email: string) => {
                set({ email })
                const user = useAuthStore.getState().user
                if (user) {
                    get().saveToFirestore(user.uid)
                }
            },
            phone: '',
            setPhone: (phone: string) => {
                set({ phone })
                const user = useAuthStore.getState().user
                if (user) {
                    get().saveToFirestore(user.uid)
                }
            },
            company: '',
            setCompany: (company: string) => {
                set({ company })
                const user = useAuthStore.getState().user
                if (user) {
                    get().saveToFirestore(user.uid)
                }
            },
            address: '',
            setAddress: (address: string) => {
                set({ address })
                const user = useAuthStore.getState().user
                if (user) {
                    get().saveToFirestore(user.uid)
                }
            },
            syncWithFirestore: (userId: string) => {
                const userRef = doc(db, 'users', userId)

                // Listen for real-time updates from Firestore
                const unsubscribe = onSnapshot(userRef, snapshot => {
                    if (snapshot.exists()) {
                        const data = snapshot.data() as UserData
                        set({
                            name: data.name || '',
                            initials: data.initials || '',
                            email: data.email || '',
                            phone: data.phone || '',
                            company: data.company || '',
                            address: data.address || '',
                        })
                    } else {
                        // If document doesn't exist, push local data to Firestore
                        get().saveToFirestore(userId)
                    }
                }, error => {
                    console.error('Error syncing user data:', error)
                })

                return unsubscribe
            },
            saveToFirestore: async (userId: string) => {
                try {
                    const { name, initials, email, phone, company, address } = get()
                    const userRef = doc(db, 'users', userId)
                    await setDoc(userRef, {
                        name,
                        initials,
                        email,
                        phone,
                        company,
                        address,
                    }, { merge: true })
                } catch (error) {
                    console.error('Error saving to Firestore:', error)
                }
            },
        }),
        {
            name: createStoreName('user'),
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
