import { prisma } from '../db/client';
import {
  ProductCreate,
  ProductReturn,
  ProductUpdate,
} from '../schema/product.schema';

export async function getAllProducts(): Promise<any[] | null> {
  return await prisma.product.findMany();
}

export async function getProductById(params: string): Promise<any | null> {
  return await prisma.product.findUnique({
    where: { id: params },
  });
}

export async function createProduct(
  payload: ProductCreate
): Promise<ProductReturn | null> {
  return await prisma.product.create({
    data: payload,
  });
}

export async function updateProduct(
  params: string,
  payload: ProductUpdate
): Promise<ProductReturn | null> {
  return await prisma.product.update({
    where: { id: params },
    data: payload,
  });
}

export async function deleteProduct(params: string): Promise<any | null> {
  return await prisma.product.delete({
    where: {
      id: params,
    },
  });
}
