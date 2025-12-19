export type FieldType = 'text' | 'date' | 'fullName' | 'initials'
    | 'email' | 'phone' | 'company' | 'address' | 'address2' | 'checkbox' | 'radio' | 'x'

export type TextField = {
    id: string
    text: string
    x: number
    y: number
    width: number
    height: number
    isNew?: boolean
    fontFamily: string
    fontSize: number
    color: string
    isBold: boolean
    isItalic: boolean
    isUnderline: boolean
    isStrikethrough: boolean
    page: number
    fieldType: FieldType
}

export type Signature = {
    id: string
    dataUrl: string
    type: 'draw' | 'type' | 'upload'
    createdAt: number
}

export type SignatureField = {
    id: string
    signatureId: string
    dataUrl: string
    x: number
    y: number
    width: number
    height: number
    page: number
    isNew?: boolean
}
