import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createStoreName } from '@/store/store'
import { doc, setDoc, getDoc, collection, onSnapshot } from 'firebase/firestore'
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
    syncWithFirestore: (userId: string) => () => void
}

export const useDocumentsStore = create<DocumentsStore>()(
    persist(
        (set, get) => ({
            savedStates: {},

            saveDocumentState: async (hash: string, state: DocumentState) => {
                // Update local state immediately
                set(prev => ({
                    savedStates: {
                        ...prev.savedStates,
                        [hash]: state,
                    },
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
                                set(prev => ({
                                    savedStates: {
                                        ...prev.savedStates,
                                        [hash]: remoteState,
                                    },
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
                set(prev => {
                    const newStates = { ...prev.savedStates }
                    delete newStates[hash]
                    return { savedStates: newStates }
                })
            },

            syncWithFirestore: (userId: string) => {
                const collectionRef = collection(db, 'users', userId, 'documents')

                const unsubscribe = onSnapshot(collectionRef, snapshot => {
                    const remoteDocs: Record<string, DocumentState> = {}

                    snapshot.forEach(doc => {
                        const data = doc.data() as DocumentState
                        // Use the document ID as hash if hash property is missing, though it should match
                        const hash = doc.id
                        remoteDocs[hash] = data
                    })

                    set(prev => {
                        const newStates = { ...prev.savedStates }
                        let hasChanges = false

                        // Update local from remote if remote is newer
                        Object.entries(remoteDocs).forEach(([hash, remoteState]) => {
                            const localState = newStates[hash]
                            if (!localState || remoteState.lastModified > localState.lastModified) {
                                newStates[hash] = remoteState
                                hasChanges = true
                            }
                        })

                        // Check for local docs that need to be pushed (newer or missing on remote)
                        // We do this inside the snapshot callback to ensure we have the latest remote state
                        // However, we must be careful not to trigger infinite loops. 
                        // Since setDoc updates the local cache immediately in Firestore SDK, 
                        // and we only write if local > remote, it should converge.
                        Object.values(newStates).forEach(localState => {
                            const remoteState = remoteDocs[localState.hash]
                            if (!remoteState || localState.lastModified > remoteState.lastModified) {
                                const docRef = doc(db, 'users', userId, 'documents', localState.hash)
                                // We don't await this as we're inside a sync callback
                                setDoc(docRef, localState, { merge: true }).catch(err =>
                                    console.error('Error syncing document upstream:', err)
                                )
                            }
                        })

                        return hasChanges ? { savedStates: newStates } : prev
                    })
                }, error => {
                    console.error('Error syncing documents:', error)
                })

                return unsubscribe
            },
        }),
        {
            name: createStoreName('documents'),
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
