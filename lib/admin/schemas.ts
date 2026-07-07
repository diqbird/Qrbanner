import { z } from 'zod';

export const adminUserPatchSchema = z.object({
  userId: z.string().min(1),
  plan: z.enum(['free', 'pro', 'business', 'agency']).optional(),
  role: z.enum(['user', 'admin']).optional(),
});

export const adminListQuerySchema = z.object({
  q: z.string().optional(),
  plan: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export const adminImpersonateSchema = z.object({
  userId: z.string().min(1),
});

export type AdminListQuery = z.infer<typeof adminListQuerySchema>;
