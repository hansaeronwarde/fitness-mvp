import { z } from 'zod';

export const assignMembershipSchema = z.object({
  memberId: z.uuid(),
  planId: z.uuid(),
  startDate: z.coerce.date(),
});

export const cancelMembershipSchema = z.object({
  endDate: z.coerce.date(),
});
