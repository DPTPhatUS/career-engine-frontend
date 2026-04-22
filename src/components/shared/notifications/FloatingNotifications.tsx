import { X } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'

function FloatingNotifications() {
  const { notifications, dismissNotification } = useNotification()

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3 sm:bottom-6 sm:right-6">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          role="alert"
          className={`pointer-events-auto alert ${notification.type === 'error' ? 'alert-error' : 'alert-success'}`}
        >
          <span>{notification.message}</span>
          <button
            type="button"
            className="btn btn-ghost btn-sm ml-auto"
            aria-label="Dismiss notification"
            onClick={() => dismissNotification(notification.id)}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default FloatingNotifications
