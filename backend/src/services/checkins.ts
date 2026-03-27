import { prisma } from '../lib/prisma'

export async function createCheckIn(memberId: string) {
  return prisma.checkIn.create({ data: { memberId } })
}

export async function getLastCheckIn(memberId: string) {
  return prisma.checkIn.findFirst({
    where: { memberId },
    orderBy: { createdAt: 'desc' },
  })
}
