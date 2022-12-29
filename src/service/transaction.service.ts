import { prisma } from '../db/client';

export async function getAllTransactions(): Promise<any[] | null> {
  return prisma.transaction.findMany();
}

export async function getUserCurrentTransaction(
  userId: string
): Promise<any | null> {
  const currentTransaction = await prisma.transaction.findFirst({
    where: {
      user_id: userId,
      status: 'Unpaid',
    },
  });

  let transactionId = currentTransaction?.id;

  // return transaction items
  let items = await prisma.transactionItems.findMany({
    where: {
      transaction_id: transactionId,
    },
    select: {
      id: true,
      transaction_id: true,
      product: true,
    },
  });

  return items;
}

export async function addToCart(payload: any): Promise<any | null> {
  // search if transaction is already in db
  let transaction = await prisma.transaction.findFirst({
    where: {
      user_id: payload.userId,
      status: 'Unpaid',
    },
  });

  // create transaction
  if (!transaction) {
    transaction = await prisma.transaction.create({
      data: {
        // user_id: payload.userId,
        user: {
          connect: { id: payload.userId },
        },
      },
    });
  }

  // check item if already in the cart
  let item = await prisma.transactionItems.findFirst({
    where: {
      product_id: payload.productId,
      transaction_id: transaction.id,
    },
  });

  // if item already in the card don't add
  if (item) {
    return null;
  }

  // add item to transaction
  const addedItem = await prisma.transactionItems.create({
    data: {
      // transaction_id: transaction.id,
      transaction: {
        connect: { id: transaction.id },
      },
      // product_id: payload.productId,
      product: {
        connect: { id: payload.productId },
      },
      amount: payload.amount,
    },
  });

  return addedItem;
}
