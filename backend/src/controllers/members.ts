import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../middleware/errorHandler'
import * as membersService from '../services/members'

export async function createMember(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email } = req.body as { name: string; email: string }
    const existing = await membersService.findMemberByEmail(email)
    if (existing) throw new AppError(409, 'A member with that email already exists')

    const member = await membersService.createMember({ name, email })
    res.status(201).json({ data: member })
  } catch (err) {
    next(err)
  }
}

export async function listMembers(req: Request, res: Response, next: NextFunction) {
  try {
    const { q } = req.query as { q?: string }
    const members = await membersService.listMembers(q)
    res.json({ data: members })
  } catch (err) {
    next(err)
  }
}

export async function getMemberSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as { id: string }

    const member = await membersService.findMemberById(id)
    if (!member) throw new AppError(404, 'Member not found')

    const summary = await membersService.getMemberSummary(id)

    res.json({
      data: {
        ...member,
        activeMembership: summary.activeMembership,
        lastCheckIn: summary.lastCheckIn,
        checkInsLast30Days: summary.checkInsLast30Days,
      },
    })
  } catch (err) {
    next(err)
  }
}
