import { request } from './client'

export function createCheckIn(memberId: string): Promise<{ id: string; memberId: string; createdAt: string }> {
  return request('/checkins', {
    method: 'POST',
    body: JSON.stringify({ memberId }),
  })
}
