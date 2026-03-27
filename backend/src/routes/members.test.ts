import { describe, expect, it, vi } from 'vitest'
import { membersRouter } from './members'

vi.mock('../lib/prisma', () => ({
  prisma: {
    member: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    membership: {
      findFirst: vi.fn(),
    },
    checkIn: {
      findFirst: vi.fn(),
      count: vi.fn(),
    },
  },
}))

const { prisma } = await import('../lib/prisma')

function invoke(req: any) {
  return new Promise<{ body: any; status: number | undefined }>((resolve, reject) => {
    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn((body: any) => resolve({ body, status: res.status.mock.calls[0]?.[0] })),
    }
    membersRouter.handle(req, res, (err: any) => {
      if (err) reject(err)
      else resolve({ body: undefined, status: undefined })
    })
  })
}

describe('members routes', () => {
  it('lists members', async () => {
    prisma.member.findMany.mockResolvedValueOnce([
      { id: '1', name: 'Jane Doe', email: 'jane@example.com', createdAt: new Date(), updatedAt: new Date() },
    ])

    const res = await invoke({ method: 'GET', url: '/', query: {} })

    expect(res.status).toBeUndefined()
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].name).toBe('Jane Doe')
  })

  it('creates a member', async () => {
    prisma.member.findUnique.mockResolvedValueOnce(null)
    prisma.member.create.mockResolvedValueOnce({
      id: '2',
      name: 'John Smith',
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const res = await invoke({
      method: 'POST',
      url: '/',
      body: { name: 'John Smith', email: 'john@example.com' },
    })

    expect(res.status).toBe(201)
    expect(res.body.data.email).toBe('john@example.com')
  })
})
