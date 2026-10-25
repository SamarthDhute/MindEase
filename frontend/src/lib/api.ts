import axios from 'axios'
import type { AssessmentResponse } from '../types'

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  res => res,
  err => {
    console.error('[MindEase API]', err)
    return Promise.reject(err)
  },
)

export async function predictAssessment(responses: Record<string, string | number>): Promise<AssessmentResponse> {
  const { data } = await api.post<AssessmentResponse>('/api/v1/assessments/predict', { responses })
  return data
}

export async function checkHealth(): Promise<{ status: string }> {
  const { data } = await api.get<{ status: string }>('/health')
  return data
}

export default api
