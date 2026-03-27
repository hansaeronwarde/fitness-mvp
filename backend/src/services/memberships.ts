import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

export async function getActiveMembership(memberId: string) {
  return prisma.membership.findFirst({
    where: { memberId, status: 'active' },
  })
}

export async function createMembership(data: {
  memberId: string
  planId: string
  startDate: Date
}) {
  return prisma.$transaction(
    async (tx) => {
      const existing = await tx.membership.findFirst({
        where: { memberId: data.memberId, status: 'active' },
      })
      if (existing) return { conflict: true as const }

      const membership = await tx.membership.create({
        data: { ...data, status: 'active' },
        include: { plan: true },
      })

      return { conflict: false as const, membership }
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  )
}

export async function findMembershipById(id: string) {
  return prisma.membership.findUnique({ where: { id } })
}

export async function cancelMembership(id: string, endDate: Date) {
  return prisma.membership.update({
    where: { id },
    data: { status: 'cancelled', endDate },
    include: { plan: true },
  })
}
