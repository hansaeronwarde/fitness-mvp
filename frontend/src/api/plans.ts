import type { Plan } from '../types'
import { request } from './client'

export function listPlans(): Promise<Plan[]> {
  return request<Plan[]>('/plans')
}
