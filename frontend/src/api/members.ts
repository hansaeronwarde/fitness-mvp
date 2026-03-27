import type { Member, MemberSummary } from '../types'
import { request } from './client'

export function listMembers(q?: string, signal?: AbortSignal): Promise<Member[]> {
  const params = q ? `?q=${encodeURIComponent(q)}` : ''
  return request<Member[]>(`/members${params}`, { signal })
}

export function getMember(id: string): Promise<MemberSummary> {
  return request<MemberSummary>(`/members/${id}`)
}

export function createMember(data: { name: string; email: string }): Promise<Member> {
  return request<Member>('/members', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
