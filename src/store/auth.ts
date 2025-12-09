import { create } from 'zustand'
import { User, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

interface AuthState {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  initialize: () => void
}

export const useAuthStore = create<AuthState>(set => ({
    user: null,
    loading: true,
  
    signInWithGoogle: async () => {
        try {
            await signInWithPopup(auth, googleProvider)
            // User state will be updated by onAuthStateChanged listener
        } catch (error) {
            console.error('Error signing in with Google:', error)
            throw error
        }
    },
  
    signOut: async () => {
        try {
            await firebaseSignOut(auth)
            // User state will be updated by onAuthStateChanged listener
        } catch (error) {
            console.error('Error signing out:', error)
            throw error
        }
    },
  
    initialize: () => {
        onAuthStateChanged(auth, user => {
            set({ user, loading: false })
        })
    },
}))
