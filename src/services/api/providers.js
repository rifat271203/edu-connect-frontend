import { BaseApiClient, createClientProvider } from './client'

export const useAuthApiClient = createClientProvider(() => new BaseApiClient('/api/auth'))
export const useAiApiClient = createClientProvider(() => new BaseApiClient('/api/ai'))
export const useSocialApiClient = createClientProvider(() => new BaseApiClient('/api/social'))
export const useMeetingApiClient = createClientProvider(() => new BaseApiClient('/api/meetings'))
export const useClassroomApiClient = createClientProvider(() => new BaseApiClient('/api/classroom'))
