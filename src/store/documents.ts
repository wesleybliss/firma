import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createStoreName } from '@/store/store'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { TextField, SignatureField } from '@/types'
import { useAuthStore } from './auth'

export type DocumentState = {
    hash: string
    textFields: TextField[]
    signatureFields: SignatureField[]
    lastModified: number
    fileName: string
}

type DocumentsStore = {
    // Local cache of document states keyed by hash
    savedStates: Record<string, DocumentState>

    // Actions
    saveDocumentState: (hash: string, state: DocumentState) => Promise<void>
    loadDocumentState: (hash: string) => Promise<DocumentState | null>
    clearDocumentState: (hash: string) => void
}

export const useDocumentsStore = create<DocumentsStore>()(
    persist(
        (set, get) => ({
            savedStates: {},

            saveDocumentState: async (hash: string, state: DocumentState) => {
                // Update local state immediately
                set((prev) => ({
                    savedStates: {
                        ...prev.savedStates,
                        [hash]: state
                    }
                }))

                const user = useAuthStore.getState().user
                if (user) {
                    try {
                        const docRef = doc(db, 'users', user.uid, 'documents', hash)
                        await setDoc(docRef, state, { merge: true })
                    } catch (error) {
                        console.error('Error saving document state to Firestore:', error)
                    }
                }
            },

            loadDocumentState: async (hash: string) => {
                // Try local first
                const localState = get().savedStates[hash]

                const user = useAuthStore.getState().user
                // If we have a user, try to fetch from Firestore to get latest
                if (user) {
                    try {
                        const docRef = doc(db, 'users', user.uid, 'documents', hash)
                        const snap = await getDoc(docRef)

                        if (snap.exists()) {
                            const remoteState = snap.data() as DocumentState

                            // Update local cache if remote is newer or we don't have local
                            if (!localState || remoteState.lastModified > localState.lastModified) {
                                set((prev) => ({
                                    savedStates: {
                                        ...prev.savedStates,
                                        [hash]: remoteState
                                    }
                                }))
                                return remoteState
                            }
                        }
                    } catch (error) {
                        console.error('Error loading document state from Firestore:', error)
                    }
                }

                return localState || null
            },

            clearDocumentState: (hash: string) => {
                set((prev) => {
                    const newStates = { ...prev.savedStates }
                    delete newStates[hash]
                    return { savedStates: newStates }
                })
            }
        }),
        {
            name: createStoreName('documents'),
            storage: createJSONStorage(() => localStorage),
        }
    )
)
