// API Client Configuration
// Centralized, resilient HTTP layer for all backend communication

const DEFAULT_API_BASE_URL = 'https://edu-connect-backend-production.up.railway.app'

const normalizeBaseUrl = (value: string): string => value.replace(/\/+$/, '')

export const getApiBaseUrl = (): string => {
  const envBaseUrl = process.env.NUXT_PUBLIC_BACKEND_URL || DEFAULT_API_BASE_URL

  try {
    const runtimeConfig = useRuntimeConfig()
    const runtimeBaseUrl = runtimeConfig.public?.backendUrl

    if (typeof runtimeBaseUrl === 'string' && runtimeBaseUrl.trim()) {
      return normalizeBaseUrl(runtimeBaseUrl)
    }
  } catch {
    // Falls back to env/default when Nuxt app context is unavailable.
  }

  return normalizeBaseUrl(envBaseUrl)
}

export const API_BASE_URL = getApiBaseUrl()

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  token?: string
  status: number
}

const getToken = (): string | null => {
  if (!process.client) {
    return null
  }

  return localStorage.getItem('educonnect_token')
}

const getFetchOptions = (method: HttpMethod, body?: unknown): RequestInit => {
  const options: RequestInit = {
    method,
    headers: {},
  }

  const token = getToken()
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  if (body !== undefined) {
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/json',
    }
    options.body = JSON.stringify(body)
  }

  return options
}

const parseResponseBody = async (response: Response): Promise<unknown> => {
  if (response.status === 204) {
    return undefined
  }

  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return await response.json()
  }

  const text = await response.text()
  return text ? { message: text } : undefined
}

const getErrorMessage = (payload: unknown, fallbackStatus: number): string => {
  if (typeof payload === 'string') {
    return payload
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    if (typeof record.message === 'string') return record.message
    if (typeof record.error === 'string') return record.error
  }

  return fallbackStatus
    ? `Request failed with status ${fallbackStatus}`
    : 'Unable to connect to server'
}

export const apiRequest = async <T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  body?: unknown
): Promise<ApiResponse<T>> => {
  try {
    const baseUrl = getApiBaseUrl()
    const response = await fetch(`${baseUrl}${endpoint}`, getFetchOptions(method, body))
    const rawPayload = await parseResponseBody(response)

    if (!response.ok) {
      return {
        success: false,
        error: getErrorMessage(rawPayload, response.status),
        status: response.status,
      }
    }

    const payloadRecord =
      rawPayload && typeof rawPayload === 'object'
        ? (rawPayload as Record<string, unknown>)
        : undefined

    const unwrappedData = payloadRecord?.data !== undefined ? payloadRecord.data : rawPayload
    const token =
      (typeof payloadRecord?.token === 'string' ? payloadRecord.token : undefined) ||
      (unwrappedData && typeof unwrappedData === 'object' && typeof (unwrappedData as Record<string, unknown>).token === 'string'
        ? ((unwrappedData as Record<string, unknown>).token as string)
        : undefined)

    return {
      success: true,
      data: unwrappedData as T,
      token,
      status: response.status,
    }
  } catch (error) {
    console.error('API Error:', error)
    return {
      success: false,
      error: 'Unable to connect to server',
      status: 0,
    }
  }
}

