import type { Membership } from '../types'
import { request } from './client'

export function assignMembership(data: {
  memberId: string
  planId: string
  startDate: string
}): Promise<Membership> {
  return request<Membership>('/memberships', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function cancelMembership(id: string, endDate: string): Promise<Membership> {
  return request<Membership>(`/memberships/${id}/cancel`, {
    method: 'PATCH',
    body: JSON.stringify({ endDate }),
  })
}
