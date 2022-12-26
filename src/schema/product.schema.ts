import { z } from 'zod';

export const productCreate = z.object({
  name: z.string().min(2).max(60),
  description: z.string().min(10).max(500),
  stock: z.number().int().positive(),
  sku: z.string().min(8).max(12),
  price: z.number().positive(),
});

export const productUpdate = z.object({
  name: z.string().min(2).max(60).optional(),
  description: z.string().min(10).max(500).optional(),
  stock: z.number().int().positive().optional(),
  sku: z.string().min(8).max(12).optional(),
  price: z.number().positive().optional(),
});

export const productReturn = productUpdate;

export type ProductCreate = z.infer<typeof productCreate>;
export type ProductUpdate = z.infer<typeof productUpdate>;
export type ProductReturn = z.infer<typeof productReturn>;
