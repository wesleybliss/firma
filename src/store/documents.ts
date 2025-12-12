import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createStoreName } from '@/store/store'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { TextField, SignatureField } from '@/types'
import { useAuthStore } from './auth'

export type DocumentState = {
    hash: string
    textFields: TextField[]
    signatureFields: SignatureField[]
    lastModified: number
    fileName: string
    // hasNativeEditableFieldsFlattened: boolean
}

type DocumentsStore = {
    // Local cache of document states keyed by hash
    savedStates: Record<string, DocumentState>

    // Actions
    saveDocumentState: (hash: string, state: DocumentState) => void
    loadDocumentState: (hash: string) => Promise<DocumentState | null>

    clearDocumentState: (hash: string) => void
    clearAllDocumentStates: () => void

    syncWithFirestore: (userId: string) => () => void
    saveToFirestore: (userId: string) => Promise<void>
}

export const useDocumentsStore = create<DocumentsStore>()(
    persist(
        (set, get) => ({
            savedStates: {},

            saveDocumentState: (hash: string, state: DocumentState) => {
                // Update local state immediately
                set(prev => ({
                    savedStates: {
                        ...prev.savedStates,
                        [hash]: state,
                    },
                }))

                const user = useAuthStore.getState().user
                if (user) {
                    get().saveToFirestore(user.uid)
                }
            },

            loadDocumentState: async (hash: string) => {
                return get().savedStates[hash] || null
            },

            clearDocumentState: (hash: string) => {
                set(prev => {
                    const newStates = { ...prev.savedStates }
                    delete newStates[hash]
                    return { savedStates: newStates }
                })
                const user = useAuthStore.getState().user
                if (user) {
                    get().saveToFirestore(user.uid)
                }
            },

            clearAllDocumentStates: () => {
                set(() => ({ savedStates: {} }))
                const user = useAuthStore.getState().user
                if (user) {
                    get().saveToFirestore(user.uid)
                }
            },

            syncWithFirestore: (userId: string) => {
                const userRef = doc(db, 'users', userId)

                const unsubscribe = onSnapshot(userRef, snapshot => {
                    if (snapshot.exists()) {
                        const data = snapshot.data()
                        if (data.documents) {
                            set({ savedStates: data.documents })
                        } else {
                            // If documents field is missing in Firestore (but doc exists), push local docs
                            get().saveToFirestore(userId)
                        }
                    } else {
                        // If document doesn't exist, push local docs to Firestore
                        get().saveToFirestore(userId)
                    }
                }, error => {
                    console.error('Error syncing documents:', error)
                })

                return unsubscribe
            },

            saveToFirestore: async (userId: string) => {
                try {
                    const { savedStates } = get()
                    const userRef = doc(db, 'users', userId)
                    await setDoc(userRef, {
                        documents: savedStates,
                    }, { merge: true })
                } catch (error) {
                    console.error('Error saving documents to Firestore:', error)
                }
            },
        }),
        {
            name: createStoreName('documents'),
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
