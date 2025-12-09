import { APP_NAME } from '@/lib/constants'

export const createStoreName = (name: string) =>
    `${APP_NAME}-${name}`.toLowerCase()
