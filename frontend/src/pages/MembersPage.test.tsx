import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import MembersPage from './MembersPage'

vi.mock('../api/members', () => ({
  listMembers: vi.fn(),
}))

const { listMembers } = await import('../api/members')

describe('MembersPage', () => {
  it('renders members from API', async () => {
    vi.useFakeTimers()
    vi.mocked(listMembers).mockResolvedValueOnce([
      {
        id: '1', name: 'Jane Doe', email: 'jane@example.com', createdAt: new Date().toLocaleDateString(),
        updatedAt: new Date().toLocaleDateString(),
      },
    ])

    render(
      <MemoryRouter>
        <MembersPage />
      </MemoryRouter>
    )

    await act(async () => {
      vi.runAllTimers()
      await Promise.resolve()
    })

    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    vi.useRealTimers()
  })
})
