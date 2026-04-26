// API architecture: Config -> Client provider -> Base client -> HTTP executor

const DEFAULT_API_BASE_URL = 'https://edu-connect-backend-bcf0.onrender.com'

const normalizeBaseUrl = (value: string): string => value.replace(/\/+$/, '')

const readRuntimePublicConfig = (): Record<string, unknown> => {
  try {
    return useRuntimeConfig().public || {}
  } catch {
    return {}
  }
}

export const getApiBaseUrl = (): string => {
  const runtimePublic = readRuntimePublicConfig()
  const runtimeBaseUrl = runtimePublic.backendUrl || runtimePublic.apiUrl
  const envBaseUrl =
    process.env.NUXT_PUBLIC_BACKEND_URL ||
    process.env.NUXT_PUBLIC_API_URL ||
    DEFAULT_API_BASE_URL

  if (typeof runtimeBaseUrl === 'string' && runtimeBaseUrl.trim()) {
    return normalizeBaseUrl(runtimeBaseUrl)
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

export interface ApiConfig {
  host: string
  apiKey?: string
  deviceId?: string
  authToken?: string
  dbId?: string
}

const readStorageValue = (key: string): string | undefined => {
  if (!process.client) {
    return undefined
  }

  const value = localStorage.getItem(key)
  return value || undefined
}

export const getApiConfig = (): ApiConfig => {
  const runtimePublic = readRuntimePublicConfig()
  const runtimeApiKey =
    (typeof runtimePublic.apiKey === 'string' && runtimePublic.apiKey) ||
    (typeof runtimePublic.backendApiKey === 'string' && runtimePublic.backendApiKey) ||
    undefined

  return {
    host: getApiBaseUrl(),
    apiKey: runtimeApiKey || process.env.NUXT_PUBLIC_API_KEY || process.env.NUXT_PUBLIC_BACKEND_API_KEY || undefined,
    authToken: readStorageValue('educonnect_token'),
    deviceId: readStorageValue('educonnect_device_id'),
    dbId: readStorageValue('selectedDb'),
  }
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

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined

const getErrorMessage = (payload: unknown, fallbackStatus: number): string => {
  if (typeof payload === 'string') {
    return payload
  }

  const record = asRecord(payload)
  if (record) {
    if (typeof record.message === 'string') return record.message
    if (typeof record.error === 'string') return record.error
  }

  return fallbackStatus
    ? `Request failed with status ${fallbackStatus}`
    : 'Unable to connect to server'
}

const extractToken = (payload: unknown): string | undefined => {
  const record = asRecord(payload)
  if (!record) {
    return undefined
  }

  if (typeof record.token === 'string') {
    return record.token
  }

  const data = asRecord(record.data)
  if (data && typeof data.token === 'string') {
    return data.token
  }

  return undefined
}

const unwrapData = (payload: unknown): unknown => {
  const record = asRecord(payload)
  if (record && record.data !== undefined) {
    return record.data
  }

  return payload
}

const buildHeaders = (
  config: ApiConfig,
  body?: unknown,
  extraHeaders?: HeadersInit
): Headers => {
  const headers = new Headers(extraHeaders || {})

  if (!(body instanceof FormData) && body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (config.authToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${config.authToken}`)
  }

  if (config.apiKey && !headers.has('X-API-KEY')) {
    headers.set('X-API-KEY', config.apiKey)
  }

  if (config.deviceId && !headers.has('X-DEVICE-ID')) {
    headers.set('X-DEVICE-ID', config.deviceId)
  }

  if (config.dbId && !headers.has('X-DB-ID')) {
    headers.set('X-DB-ID', config.dbId)
  }

  return headers
}

export class HttpClient {
  async makeRequest<T>(
    url: string,
    method: HttpMethod,
    body?: unknown,
    headers?: HeadersInit
  ): Promise<ApiResponse<T>> {
    try {
      const config = getApiConfig()
      const requestHeaders = buildHeaders(config, body, headers)
      const requestBody = body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: requestBody,
      })

      const rawPayload = await parseResponseBody(response)

      if (!response.ok) {
        return {
          success: false,
          error: getErrorMessage(rawPayload, response.status),
          status: response.status,
        }
      }

      return {
        success: true,
        data: unwrapData(rawPayload) as T,
        token: extractToken(rawPayload),
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
}

export class BaseApiClient {
  private endpoint: string
  private httpClient: HttpClient

  constructor(endpoint: string, httpClient = new HttpClient()) {
    this.endpoint = endpoint
    this.httpClient = httpClient
  }

  private buildUrl(path = ''): string {
    if (/^https?:\/\//i.test(path)) {
      return path
    }

    const host = getApiConfig().host
    const endpointPath = this.endpoint
      ? this.endpoint.startsWith('/')
        ? this.endpoint
        : `/${this.endpoint}`
      : ''
    const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : ''

    return `${host}${endpointPath}${normalizedPath}`
  }

  request<T>(method: HttpMethod, path = '', body?: unknown, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.httpClient.makeRequest<T>(this.buildUrl(path), method, body, headers)
  }

  get<T>(path = ''): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path)
  }

  post<T>(path = '', body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, body)
  }

  put<T>(path = '', body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, body)
  }

  patch<T>(path = '', body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', path, body)
  }

  delete<T>(path = ''): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path)
  }

  search<T>(body?: unknown): Promise<ApiResponse<T>> {
    return this.post<T>('/search', body)
  }
}

export const createEndpointClient = (endpoint: string): BaseApiClient => new BaseApiClient(endpoint)

export const createClientProvider = <TClient>(factory: () => TClient): (() => TClient) => {
  let client: TClient | undefined

  return () => {
    if (!client) {
      client = factory()
    }

    return client
  }
}

const rootClient = new BaseApiClient('')

export const apiRequest = async <T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  body?: unknown
): Promise<ApiResponse<T>> => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return await rootClient.request<T>(method, normalizedEndpoint, body)
}

export const apiRequestForm = async <T>(
  endpoint: string,
  formData: FormData,
  method: Extract<HttpMethod, 'POST' | 'PUT' | 'PATCH'> = 'POST'
): Promise<ApiResponse<T>> => {
  return await apiRequest<T>(endpoint, method, formData)
}

