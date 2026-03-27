export interface Member {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface Plan {
  id: string
  name: string
  price: number
  durationDays: number
}

export interface Membership {
  id: string
  memberId: string
  planId: string
  startDate: string
  endDate: string | null
  status: 'active' | 'cancelled'
  plan: Plan
}

export interface MemberSummary extends Member {
  activeMembership: Membership | null
  lastCheckIn: string | null
  checkInsLast30Days: number
}
