import { createContext } from 'react'

type NotificationType = 'success' | 'error'

type NotificationRecord = {
  id: string
  message: string
  type: NotificationType
}

type NotificationOptions = {
  duration?: number
}

type NotificationContextValue = {
  notifications: NotificationRecord[]
  notifySuccess: (message: string, options?: NotificationOptions) => void
  notifyError: (message: string, options?: NotificationOptions) => void
  dismissNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export type {
  NotificationContextValue,
  NotificationOptions,
  NotificationRecord,
  NotificationType,
}
export { NotificationContext }
