import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import FloatingNotifications from './components/shared/notifications/FloatingNotifications.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { AppDataProvider } from './contexts/AppDataContext.tsx'
import { NotificationProvider } from './contexts/NotificationContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppDataProvider>
        <NotificationProvider>
          <BrowserRouter>
            <App />
            <FloatingNotifications />
          </BrowserRouter>
        </NotificationProvider>
      </AppDataProvider>
    </AuthProvider>
  </StrictMode>,
)
