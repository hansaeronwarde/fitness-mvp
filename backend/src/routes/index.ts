import { Router } from 'express'
import { membersRouter } from './members'
import { plansRouter } from './plans'
import { membershipsRouter } from './memberships'
import { checkInsRouter } from './checkins'

const router = Router()

router.use('/members', membersRouter)
router.use('/plans', plansRouter)
router.use('/memberships', membershipsRouter)
router.use('/checkins', checkInsRouter)

export { router }
