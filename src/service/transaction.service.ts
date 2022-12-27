import { prisma } from '../db/client';

export async function addToCart(payload: any): Promise<any> {
  // search if transaction is already in db
  let transaction = await prisma.transaction.findFirst({
    where: {
      user: { id: payload.userId },
    },
  });

  if (!transaction) {
    transaction = await prisma.transaction.create({
      data: {
        user: {
          connect: { id: payload.userId },
        },
      },
    });
  }

  const addedItem = await prisma.transactionItems.create({
    data: {
      transaction: {
        connect: { id: transaction.id },
      },
      product: {
        connect: { id: payload.productId },
      },
      amount: payload.amount,
    },
  });

  return addedItem;
}
