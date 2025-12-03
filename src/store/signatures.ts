import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createStoreName } from '@/store/store'
import { Signature } from '@/types'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuthStore } from './auth'

interface SignaturesState {
  signatures: Signature[]
  addSignature: (signature: Signature) => void
  removeSignature: (id: string) => void
  clearSignatures: () => void
  syncWithFirestore: (userId: string) => () => void
  saveToFirestore: (userId: string) => Promise<void>
}

export const useSignaturesStore = create<SignaturesState>()(
  persist(
    (set, get) => ({
      signatures: [],
      addSignature: (signature) => {
        set((state) => ({
          signatures: [...state.signatures, signature]
        }))
        const user = useAuthStore.getState().user
        if (user) {
          get().saveToFirestore(user.uid)
        }
      },
      removeSignature: (id) => {
        set((state) => ({
          signatures: state.signatures.filter(signature => signature.id !== id)
        }))
        const user = useAuthStore.getState().user
        if (user) {
          get().saveToFirestore(user.uid)
        }
      },
      clearSignatures: () => {
        set({ signatures: [] })
        const user = useAuthStore.getState().user
        if (user) {
          get().saveToFirestore(user.uid)
        }
      },
      syncWithFirestore: (userId: string) => {
        const userRef = doc(db, 'users', userId)

        // Listen for real-time updates from Firestore
        const unsubscribe = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data()
            if (data.signatures) {
              set({ signatures: data.signatures })
            }
          } else {
            // If document doesn't exist, push local signatures to Firestore
            get().saveToFirestore(userId)
          }
        }, (error) => {
          console.error('Error syncing signatures:', error)
        })

        return unsubscribe
      },
      saveToFirestore: async (userId: string) => {
        try {
          const { signatures } = get()
          const userRef = doc(db, 'users', userId)
          await setDoc(userRef, {
            signatures,
          }, { merge: true })
        } catch (error) {
          console.error('Error saving signatures to Firestore:', error)
        }
      },
    }),
    {
      name: createStoreName('signatures'),
      storage: createJSONStorage(() => localStorage),
    }
  )
)
