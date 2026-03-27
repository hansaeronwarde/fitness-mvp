import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listMembers } from '../api/members'
import { btn, errorMsg, input, muted } from '../styles'
import type { Member } from '../types'

export default function MembersPage() {
  const [query, setQuery] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => {
      setLoading(true)
      setError(null)
      listMembers(query || undefined, controller.signal)
        .then(setMembers)
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === 'AbortError') return
          setError(err instanceof Error ? err.message : 'Failed to load members')
        })
        .finally(() => setLoading(false))
    }, 300)
    return () => { clearTimeout(timer); controller.abort() }
  }, [query])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight m-0">Members</h1>
        <Link to="/members/new" className={btn.primary}>+ New Member</Link>
      </div>

      <input
        className={`${input} mb-4`}
        type="search"
        placeholder="Search by name or email..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {error && <p className={errorMsg}>{error}</p>}

      {loading && <p className={muted}>Loading...</p>}

      {!loading && members.length === 0 && (
        <p className={muted}>{query ? 'No members match your search.' : 'No members yet.'}</p>
      )}

      {!loading && members.length > 0 && (
        <ul className="border border-gray-200 rounded-xl overflow-hidden list-none p-0 m-0">
          {members.map(m => (
            <li key={m.id} className="flex items-center justify-between px-4 py-3.5 border-b border-gray-200 last:border-0">
              <Link to={`/members/${m.id}`} className="flex flex-col gap-0.5 no-underline flex-1 min-w-0">
                <span className="text-sm font-medium">{m.name}</span>
                <span className="text-xs">{m.email}</span>
              </Link>
              <span className="text-xs shrink-0">
                Joined {new Date(m.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
