import { z } from 'zod';

export const createCheckinSchema = z.object({
  memberId: z.uuid(),
});
