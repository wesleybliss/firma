declare module 'font-picker-react' {
  import { Component } from 'react'

  export interface Font {
    family: string
    id: string
    [key: string]: string | number | boolean | undefined
  }

  export interface FontPickerProps {
    apiKey: string
    activeFontFamily: string
    onChange: (font: Font) => void
    pickerId?: string
    families?: string[]
    categories?: string[]
    scripts?: string[]
    variants?: string[]
    filter?: (font: Font) => boolean
    limit?: number
    sort?: 'alphabetical' | 'popularity'
  }

  export default class FontPicker extends Component<FontPickerProps> {}
}
