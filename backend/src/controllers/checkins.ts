import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../middleware/errorHandler'
import * as membersService from '../services/members'
import * as membershipsService from '../services/memberships'
import * as checkinsService from '../services/checkins'

export async function createCheckIn(req: Request, res: Response, next: NextFunction) {
  try {
    const { memberId } = req.body as { memberId: string }

    const member = await membersService.findMemberById(memberId)
    if (!member) throw new AppError(404, 'Member not found')

    const activeMembership = await membershipsService.getActiveMembership(memberId)
    if (!activeMembership) {
      throw new AppError(403, 'Member does not have an active membership')
    }

    const checkIn = await checkinsService.createCheckIn(memberId)
    res.status(201).json({ data: checkIn })
  } catch (err) {
    next(err)
  }
}
