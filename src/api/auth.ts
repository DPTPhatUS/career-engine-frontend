import { api } from './client'

type LoginStartResponse = {
  authorization_url: string
  state: string
}

type AuthSession = {
  user_id: string
  email: string
}

type LogoutResponse = {
  success: boolean
}

async function startGoogleLogin(nextPath = '/home') {
  const search = new URLSearchParams({ next: nextPath })
  return api<LoginStartResponse>(`/api/v1/auth/google/login/start?${search.toString()}`)
}

async function getAuthSession() {
  return api<AuthSession>('/api/v1/auth/me')
}

async function logoutSession() {
  return api<LogoutResponse>('/api/v1/auth/logout', {
    method: 'POST',
  })
}

export { getAuthSession, logoutSession, startGoogleLogin }
export type { AuthSession, LoginStartResponse, LogoutResponse }
