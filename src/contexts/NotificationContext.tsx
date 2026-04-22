import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

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

const DEFAULT_NOTIFICATION_DURATION_MS: Record<NotificationType, number> = {
  success: 5000,
  error: 7000,
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

type NotificationProviderProps = {
  children: ReactNode
}

function createNotificationId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([])
  const timersRef = useRef(new Map<string, number>())

  const dismissNotification = useCallback((id: string) => {
    setNotifications((previous) => previous.filter((notification) => notification.id !== id))

    const existingTimer = timersRef.current.get(id)
    if (existingTimer) {
      window.clearTimeout(existingTimer)
      timersRef.current.delete(id)
    }
  }, [])

  const enqueueNotification = useCallback(
    (type: NotificationType, message: string, options?: NotificationOptions) => {
      const nextId = createNotificationId()

      setNotifications((previous) => [
        ...previous,
        {
          id: nextId,
          message,
          type,
        },
      ])

      const duration = options?.duration ?? DEFAULT_NOTIFICATION_DURATION_MS[type]
      const timerId = window.setTimeout(() => {
        dismissNotification(nextId)
      }, duration)

      timersRef.current.set(nextId, timerId)
    },
    [dismissNotification],
  )

  const notifySuccess = useCallback(
    (message: string, options?: NotificationOptions) => {
      enqueueNotification('success', message, options)
    },
    [enqueueNotification],
  )

  const notifyError = useCallback(
    (message: string, options?: NotificationOptions) => {
      enqueueNotification('error', message, options)
    },
    [enqueueNotification],
  )

  useEffect(() => {
    const timers = timersRef.current

    return () => {
      for (const timerId of timers.values()) {
        window.clearTimeout(timerId)
      }

      timers.clear()
    }
  }, [])

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      notifySuccess,
      notifyError,
      dismissNotification,
    }),
    [dismissNotification, notifications, notifyError, notifySuccess],
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

function useNotification() {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }

  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export { NotificationProvider, useNotification }
