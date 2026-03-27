import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createMember } from '../api/members'
import { btn, card, errorMsg, input } from '../styles'

export default function NewMemberPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const member = await createMember(form)
      navigate(`/members/${member.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create member')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight m-0">New Member</h1>
        <Link to="/members" className={btn.secondary}>← Back</Link>
      </div>

      <div className={card}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-medium">Name</label>
            <input
              id="name"
              className={input}
              type="text"
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium">Email</label>
            <input
              id="email"
              className={input}
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>

          {error && <p className={errorMsg}>{error}</p>}

          <div className="flex gap-2 mt-1">
            <button type="submit" className={btn.primary} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
