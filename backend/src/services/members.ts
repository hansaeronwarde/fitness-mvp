import { prisma } from '../lib/prisma'

export async function listMembers(q?: string) {
  return prisma.member.findMany({
    ...(q
      ? {
          where: {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } },
            ],
          },
        }
      : {}),
    orderBy: { createdAt: 'desc' },
  })
}

export async function findMemberById(id: string) {
  return prisma.member.findUnique({ where: { id } })
}

export async function findMemberByEmail(email: string) {
  return prisma.member.findUnique({ where: { email } })
}

export async function createMember(data: { name: string; email: string }) {
  return prisma.member.create({ data })
}

export async function getMemberSummary(memberId: string) {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [activeMembership, lastCheckIn, checkInsLast30Days] = await Promise.all([
    prisma.membership.findFirst({
      where: { memberId, status: 'active' },
      include: { plan: true },
    }),
    prisma.checkIn.findFirst({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.checkIn.count({
      where: { memberId, createdAt: { gte: thirtyDaysAgo } },
    }),
  ])

  return {
    activeMembership: activeMembership ?? null,
    lastCheckIn: lastCheckIn?.createdAt ?? null,
    checkInsLast30Days,
  }
}
