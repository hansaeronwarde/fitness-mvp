import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../middleware/errorHandler'
import * as membersService from '../services/members'
import * as plansService from '../services/plans'
import * as membershipsService from '../services/memberships'

export async function assignMembership(req: Request, res: Response, next: NextFunction) {
  try {
    const { memberId, planId, startDate } = req.body as {
      memberId: string
      planId: string
      startDate: Date
    }

    const member = await membersService.findMemberById(memberId)
    if (!member) throw new AppError(404, 'Member not found')

    const plan = await plansService.findPlanById(planId)
    if (!plan) throw new AppError(404, 'Plan not found')

    const result = await membershipsService.createMembership({ memberId, planId, startDate })
    if (result.conflict) {
      throw new AppError(409, 'Member already has an active membership')
    }

    res.status(201).json({ data: result.membership })
  } catch (err: any) {
    if (err?.code === 'P2002') {
      next(new AppError(409, 'Member already has an active membership'))
      return
    }
    next(err)
  }
}

export async function cancelMembership(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string }
    const { endDate } = req.body as { endDate: Date }

    const membership = await membershipsService.findMembershipById(id)
    if (!membership) throw new AppError(404, 'Membership not found')
    if (membership.status === 'cancelled') {
      throw new AppError(409, 'Membership is already cancelled')
    }

    const updated = await membershipsService.cancelMembership(id, endDate)
    res.json({ data: updated })
  } catch (err) {
    next(err)
  }
}
