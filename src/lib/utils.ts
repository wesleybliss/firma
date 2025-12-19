import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { sha256 } from 'js-sha256'
import type { FieldType } from '@/types'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const hashFile = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer()
    return sha256(arrayBuffer)
}

export const getFieldLabel = (fieldType: FieldType) => {
    switch (fieldType) {
        case 'text':
            return 'Text'
        case 'date':
            return 'Date'
        case 'fullName':
            return 'Full Name'
        case 'initials':
            return 'Initials'
        case 'email':
            return 'Email'
        case 'phone':
            return 'Phone'
        case 'company':
            return 'Company'
        case 'address':
            return 'Address'
        case 'address2':
            return 'Address 2'
        case 'checkbox':
            return 'Checkbox'
        case 'radio':
            return 'Radio'
        case 'x':
            return 'X-Mark'
        default:
            return null
    }
}