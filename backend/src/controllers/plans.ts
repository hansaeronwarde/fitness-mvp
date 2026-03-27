import type { Request, Response, NextFunction } from 'express'
import * as plansService from '../services/plans'

export async function listPlans(req: Request, res: Response, next: NextFunction) {
  try {
    const plans = await plansService.listPlans()
    res.json({ data: plans })
  } catch (err) {
    next(err)
  }
}
