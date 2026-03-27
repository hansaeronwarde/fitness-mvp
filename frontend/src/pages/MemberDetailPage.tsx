import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { createCheckIn } from '../api/checkins'
import { getMember } from '../api/members'
import { assignMembership, cancelMembership } from '../api/memberships'
import { listPlans } from '../api/plans'
import { btn, card, cardTitle, errorMsg, input, muted } from '../styles'
import type { MemberSummary, Plan } from '../types'

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [summary, setSummary] = useState<MemberSummary | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showAssign, setShowAssign] = useState(false)
  const [assignForm, setAssignForm] = useState({ planId: '', startDate: todayISO() })
  const [assigning, setAssigning] = useState(false)
  const [assignError, setAssignError] = useState<string | null>(null)

  const [confirmCancel, setConfirmCancel] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  const [checkingIn, setCheckingIn] = useState(false)
  const [checkInError, setCheckInError] = useState<string | null>(null)
  const [checkInSuccess, setCheckInSuccess] = useState(false)

  const load = useCallback(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    Promise.all([getMember(id), listPlans()])
      .then(([s, p]) => {
        setSummary(s)
        setPlans(p)
        if (p.length > 0 && !assignForm.planId) {
          setAssignForm(f => ({ ...f, planId: p[0].id }))
        }
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [assignForm.planId, id])

  useEffect(() => { load() }, [load])

  async function handleAssign(e: React.SubmitEvent) {
    e.preventDefault()
    if (!id) return
    setAssigning(true)
    setAssignError(null)
    try {
      await assignMembership({ memberId: id, planId: assignForm.planId, startDate: assignForm.startDate })
      setShowAssign(false)
      load()
    } catch (err) {
      setAssignError(err instanceof Error ? err.message : 'Failed to assign plan')
    } finally {
      setAssigning(false)
    }
  }

  async function handleCancel() {
    if (!summary?.activeMembership) return
    setCancelling(true)
    setCancelError(null)
    try {
      await cancelMembership(summary.activeMembership.id, todayISO())
      setConfirmCancel(false)
      load()
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : 'Failed to cancel membership')
    } finally {
      setCancelling(false)
    }
  }

  async function handleCheckIn() {
    if (!id) return
    setCheckingIn(true)
    setCheckInError(null)
    setCheckInSuccess(false)
    try {
      await createCheckIn(id)
      setCheckInSuccess(true)
      load()
    } catch (err) {
      setCheckInError(err instanceof Error ? err.message : 'Failed to record check-in')
    } finally {
      setCheckingIn(false)
    }
  }

  if (loading) return <p className={muted}>Loading...</p>
  if (error) return <p className={errorMsg}>{error}</p>
  if (!summary) return null

  const { activeMembership, lastCheckIn, checkInsLast30Days } = summary

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight m-0">{summary.name}</h1>
        <Link to="/members" className={btn.secondary}>← Members</Link>
      </div>

      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">

        {/* Profile */}
        <div className={card}>
          <p className={cardTitle}>Profile</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 m-0">
            <dt className="text-sm">Email</dt>
            <dd className="text-sm font-medium m-0">{summary.email}</dd>
            <dt className="text-sm">Member since</dt>
            <dd className="text-sm font-medium m-0">{new Date(summary.createdAt).toLocaleDateString()}</dd>
          </dl>
        </div>

        {/* Membership */}
        <div className={card}>
          <p className={cardTitle}>Membership</p>
          {activeMembership ? (
            <>
              <span className="inline-block text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border border-gray-300 mb-3">
                Active
              </span>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 m-0">
                <dt className="text-sm">Plan</dt>
                <dd className="text-sm font-medium m-0">{activeMembership.plan.name}</dd>
                <dt className="text-sm">Price</dt>
                <dd className="text-sm font-medium m-0">${activeMembership.plan.price}/mo</dd>
                <dt className="text-sm">Started</dt>
                <dd className="text-sm font-medium m-0">{new Date(activeMembership.startDate).toLocaleDateString()}</dd>
              </dl>
            </>
          ) : (
            <p className={muted}>No active membership.</p>
          )}
        </div>

        {/* Check-in stats */}
        <div className={card}>
          <p className={cardTitle}>Check-ins</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 m-0">
            <dt className="text-sm">Last check-in</dt>
            <dd className="text-sm font-medium m-0">{lastCheckIn ? new Date(lastCheckIn).toLocaleString() : '—'}</dd>
            <dt className="text-sm">Last 30 days</dt>
            <dd className="text-sm font-medium m-0">{checkInsLast30Days}</dd>
          </dl>
        </div>

        {/* Actions */}
        <div className={card}>
          <p className={cardTitle}>Actions</p>
          <div className="flex flex-col gap-3">

            {/* Check-in */}
            <div className="flex flex-col gap-1.5">
              <button
                className={btn.primary}
                disabled={!activeMembership || checkingIn}
                onClick={handleCheckIn}
                title={activeMembership ? undefined : 'No active membership'}
              >
                {checkingIn ? 'Recording...' : 'Record Check-in'}
              </button>
              {checkInSuccess && <span className="text-sm">Checked in!</span>}
              {checkInError && <span className={errorMsg}>{checkInError}</span>}
            </div>

            {/* Assign plan */}
            {!activeMembership && (
              <div className="flex flex-col gap-2">
                {showAssign ? (
                  <form onSubmit={handleAssign} className="flex flex-col gap-3 p-3 rounded-lg border border-gray-200">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="plan" className="text-xs font-medium">Plan</label>
                      <select
                        id="plan"
                        className={input}
                        value={assignForm.planId}
                        onChange={e => setAssignForm(f => ({ ...f, planId: e.target.value }))}
                        required
                      >
                        {plans.map(p => (
                          <option key={p.id} value={p.id}>{p.name} — ${p.price}/mo</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="startDate" className="text-xs font-medium">Start date</label>
                      <input
                        id="startDate"
                        className={input}
                        type="date"
                        required
                        value={assignForm.startDate}
                        onChange={e => setAssignForm(f => ({ ...f, startDate: e.target.value }))}
                      />
                    </div>
                    {assignError && <p className={errorMsg}>{assignError}</p>}
                    <div className="flex gap-2">
                      <button type="submit" className={btn.primary} disabled={assigning}>
                        {assigning ? 'Assigning...' : 'Confirm'}
                      </button>
                      <button type="button" className={btn.ghost} onClick={() => { setShowAssign(false); setAssignError(null) }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button className={btn.secondary} onClick={() => setShowAssign(true)}>
                    Assign Plan
                  </button>
                )}
              </div>
            )}

            {/* Cancel membership */}
            {activeMembership && (
              <div className="flex flex-col gap-1.5">
                {confirmCancel ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={muted}>Are you sure?</span>
                    <button className={btn.danger} disabled={cancelling} onClick={handleCancel}>
                      {cancelling ? 'Cancelling...' : 'Yes, cancel'}
                    </button>
                    <button className={btn.ghost} onClick={() => { setConfirmCancel(false); setCancelError(null) }}>
                      Keep it
                    </button>
                    {cancelError && <span className={errorMsg}>{cancelError}</span>}
                  </div>
                ) : (
                  <button className={btn.dangerOutline} onClick={() => setConfirmCancel(true)}>
                    Cancel Membership
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

function todayISO(): string {
  return new Date().toLocaleDateString()
}
