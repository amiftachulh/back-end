import { prisma } from '../db/client';

export async function getAllTransactions(): Promise<any[] | null> {
  return await prisma.transaction.findMany();
}

export async function getTransactionById(
  transactionId: string
): Promise<any | null> {
  return await prisma.transaction.findUnique({
    where: {
      id: transactionId,
    },
  });
}
