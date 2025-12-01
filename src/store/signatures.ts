import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createStoreName } from '@/store/store'
import { Signature } from '@/types'

interface SignaturesState {
  signatures: Signature[]
  addSignature: (signature: Signature) => void
  removeSignature: (id: string) => void
  clearSignatures: () => void
}

export const useSignaturesStore = create<SignaturesState>()(
  persist(
    (set) => ({
      signatures: [],
      addSignature: (signature) => set((state) => ({ 
        signatures: [...state.signatures, signature] 
      })),
      removeSignature: (id) => set((state) => ({ 
        signatures: state.signatures.filter(signature => signature.id !== id)
      })),
      clearSignatures: () => set({ signatures: [] }),
    }),
    {
      name: createStoreName('signatures'),
      storage: createJSONStorage(() => localStorage),
    }
  )
)