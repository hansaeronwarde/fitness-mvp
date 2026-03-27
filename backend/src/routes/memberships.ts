import { Router } from 'express'
import { validate } from '../middleware/validate'
import { assignMembershipSchema, cancelMembershipSchema } from '../schemas/membership'
import { assignMembership, cancelMembership } from '../controllers/memberships'

const router = Router()

// POST /api/memberships — assign a plan to a member
router.post('/', validate(assignMembershipSchema), assignMembership)

// PATCH /api/memberships/:id/cancel
router.patch('/:id/cancel', validate(cancelMembershipSchema), cancelMembership)

export { router as membershipsRouter }
