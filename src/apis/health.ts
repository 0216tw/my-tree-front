import { http } from '@/apis/http'

export interface HealthCheckResponse {
  status: string
  timestamp?: string
  [key: string]: unknown
}

export async function fetchHealthCheck() {
  const response = await http.get<HealthCheckResponse>('/health')
  return response.data
}
