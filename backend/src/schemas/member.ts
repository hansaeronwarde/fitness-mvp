import { z } from 'zod';

export const createMemberSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export const listMembersSchema = z.object({
  q: z.string().optional(),
});
