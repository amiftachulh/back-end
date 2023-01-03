import { z } from 'zod';

export const itemAmount = z.object({
  amount: z.number().gt(0),
});

export type ItemAmount = z.infer<typeof itemAmount>;
