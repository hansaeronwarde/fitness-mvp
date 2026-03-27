import { Router } from 'express'
import { listPlans } from '../controllers/plans'

const router = Router()

// GET /api/plans
router.get('/', listPlans)

export { router as plansRouter }
