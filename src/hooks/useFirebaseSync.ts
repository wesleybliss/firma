import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { useUserStore } from '@/store/user'
import { useSignaturesStore } from '@/store/signatures'
import { useDocumentsStore } from '@/store/documents'

/**
 * Hook to sync user data and signatures with Firestore when authenticated
 */
export function useFirebaseSync() {
    const { user, loading } = useAuthStore()
    const syncUserData = useUserStore(state => state.syncWithFirestore)
    const syncSignatures = useSignaturesStore(state => state.syncWithFirestore)
    const syncDocuments = useDocumentsStore(state => state.syncWithFirestore)

    useEffect(() => {
        if (loading) return

        if (user) {
            // Set up real-time sync for user data and signatures
            const unsubscribeUser = syncUserData(user.uid)
            const unsubscribeSignatures = syncSignatures(user.uid)
            const unsubscribeDocuments = syncDocuments(user.uid)

            return () => {
                unsubscribeUser()
                unsubscribeSignatures()
                unsubscribeDocuments()
            }
        }
    }, [user, loading, syncUserData, syncSignatures, syncDocuments])
}
