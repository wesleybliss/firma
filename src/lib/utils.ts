import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { sha256 } from 'js-sha256'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const hashFile = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer()
    return sha256(arrayBuffer)
}
