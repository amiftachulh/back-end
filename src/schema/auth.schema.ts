import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(4).max(30),
  password: z.string().min(8).max(32),
});

export const jwtPayloadSchema = z.object({
  id: z.string().cuid(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type JwtPayloadSchema = z.infer<typeof jwtPayloadSchema>;
