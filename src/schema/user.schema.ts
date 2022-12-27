import { z } from 'zod';

export const userCreate = z.object({
  username: z.string().min(4).max(30),
  password: z.string().min(8).max(32),
  email: z.string().email().max(254),
});

export const userUpdate = z.object({
  username: z.string().min(4).max(30).optional(),
  password: z.string().min(8).max(32).optional(),
  email: z.string().email().max(254).optional(),
});

export const userReturn = userUpdate.omit({ password: true, role: true });

export type UserCreate = z.infer<typeof userCreate>;
export type UserUpdate = z.infer<typeof userUpdate>;
export type UserReturn = z.infer<typeof userReturn>;
