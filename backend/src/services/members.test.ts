import { describe, expect, it, vi } from 'vitest'
import { listMembers } from './members'

vi.mock('../lib/prisma', () => ({
  prisma: {
    member: {
      findMany: vi.fn(),
    },
  },
}))

const { prisma } = await import('../lib/prisma')

describe('members service', () => {
  it('returns members list', async () => {
    prisma.member.findMany.mockResolvedValueOnce([
      { id: '1', name: 'Jane Doe', email: 'jane@example.com' },
    ])

    const result = await listMembers('jane')

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Jane Doe')
  })
})
