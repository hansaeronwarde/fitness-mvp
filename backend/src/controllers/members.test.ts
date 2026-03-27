import { describe, expect, it, vi } from 'vitest'
import { createMember, listMembers } from './members'
import * as membersService from '../services/members'
import { AppError } from '../middleware/errorHandler'

vi.mock('../services/members', () => ({
  findMemberByEmail: vi.fn(),
  createMember: vi.fn(),
  listMembers: vi.fn(),
}))

function makeRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  }
}

describe('members controller', () => {
  it('creates a member when email is unique', async () => {
    const req: any = { body: { name: 'Jane Doe', email: 'jane@example.com' } }
    const res = makeRes()
    const next = vi.fn()

    vi.mocked(membersService.findMemberByEmail).mockResolvedValueOnce(null)
    vi.mocked(membersService.createMember).mockResolvedValueOnce({
      id: '1',
      name: 'Jane Doe',
      email: 'jane@example.com',
    } as any)

    await createMember(req, res as any, next)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      data: { id: '1', name: 'Jane Doe', email: 'jane@example.com' },
    })
  })

  it('returns conflict if email already exists', async () => {
    const req: any = { body: { name: 'Jane Doe', email: 'jane@example.com' } }
    const res = makeRes()
    const next = vi.fn()

    vi.mocked(membersService.findMemberByEmail).mockResolvedValueOnce({ id: 'x' } as any)

    await createMember(req, res as any, next)

    expect(next).toHaveBeenCalled()
    const err = next.mock.calls[0][0]
    expect(err).toBeInstanceOf(AppError)
    expect(err.statusCode).toBe(409)
  })

  it('lists members', async () => {
    const req: any = { query: { q: 'jane' } }
    const res = makeRes()
    const next = vi.fn()

    vi.mocked(membersService.listMembers).mockResolvedValueOnce([
      { id: '1', name: 'Jane Doe', email: 'jane@example.com' },
    ] as any)

    await listMembers(req, res as any, next)

    expect(res.json).toHaveBeenCalledWith({
      data: [{ id: '1', name: 'Jane Doe', email: 'jane@example.com' }],
    })
  })
})
