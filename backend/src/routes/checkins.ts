import { Router } from 'express'
import { validate } from '../middleware/validate'
import { createCheckinSchema } from '../schemas/checkin'
import { createCheckIn } from '../controllers/checkins'

const router = Router()

// POST /api/checkins
router.post('/', validate(createCheckinSchema), createCheckIn)

export { router as checkInsRouter }
