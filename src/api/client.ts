const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000'

type ApiErrorBody = {
  detail?: string
}

class ApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

function getErrorMessage(body: unknown, fallback: string): string {
  if (typeof body === 'object' && body !== null && 'detail' in body) {
    const detail = (body as ApiErrorBody).detail
    if (typeof detail === 'string' && detail.trim().length > 0) {
      return detail
    }
  }

  if (typeof body === 'string' && body.trim().length > 0) {
    return body
  }

  return fallback
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    try {
      return await response.json()
    } catch {
      return undefined
    }
  }

  try {
    const text = await response.text()
    return text.length > 0 ? text : undefined
  } catch {
    return undefined
  }
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)

  if (!(init.body instanceof FormData) && init.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  })

  const body = await parseResponseBody(response)

  if (!response.ok) {
    throw new ApiError(getErrorMessage(body, response.statusText || 'Request failed'), response.status, body)
  }

  return body as T
}

export { ApiError, api, API_BASE }
