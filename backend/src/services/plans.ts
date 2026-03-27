import { prisma } from '../lib/prisma'

export async function listPlans() {
  return prisma.plan.findMany({ orderBy: { price: 'asc' } })
}

export async function findPlanById(id: string) {
  return prisma.plan.findUnique({ where: { id } })
}
