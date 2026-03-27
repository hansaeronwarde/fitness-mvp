import { Router } from 'express'
import { validate } from '../middleware/validate'
import { createMemberSchema, listMembersSchema } from '../schemas/member'
import { createMember, getMemberSummary, listMembers } from '../controllers/members'

const router = Router()

// POST /api/members
router.post('/', validate(createMemberSchema), createMember)

// GET /api/members?q=
router.get('/', validate(listMembersSchema, 'query'), listMembers)

// GET /api/members/:id — summary
router.get('/:id', getMemberSummary)

export { router as membersRouter }
