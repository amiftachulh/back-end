import { string, TypeOf, z } from 'zod';

export const transactionCreate = z.object({
  status: string(),
});

export const transactionUpdate = z.object({
  status: string().optional(),
});

export const transactionReturn = transactionUpdate;

export type TransactionCreate = z.infer<typeof transactionCreate>;
export type TransactionUpdate = z.infer<typeof transactionUpdate>;
export type TransactionReturn = z.infer<typeof transactionReturn>;
