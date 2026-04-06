// JS-first facade for API architecture utilities.
// Use this file if you prefer JavaScript imports in feature code.

export {
  API_BASE_URL,
  getApiBaseUrl,
  getApiConfig,
  HttpClient,
  BaseApiClient,
  createEndpointClient,
  createClientProvider,
  apiRequest,
  apiRequestForm,
} from './client.ts'
