import { prisma } from '../db/client';

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
          connect: {
            id: payload.userId,
          },
        },
      },
    });
  }

  // check item if already in the cart
  let item = await prisma.transaction_items.findFirst({
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
  item = await prisma.transaction_items.create({
    data: {
      transaction: {
        connect: {
          id: transaction.id,
        },
      },
      product: {
        connect: {
          id: payload.productId,
        },
      },
      amount: payload.amount,
    },
  });

  // add subtotal
  const addedItem = await prisma.transaction_items.findFirst({
    where: {
      id: item.id,
    },
    include: {
      product: true,
    },
  });

  // return
  return await prisma.transaction_items.update({
    where: {
      id: addedItem!.id,
    },
    data: {
      subtotal: addedItem!.amount * addedItem!.product.price,
    },
  });
}

export async function getAllTransactions(
  userId: string
): Promise<any[] | null> {
  return prisma.transaction.findMany({
    where: {
      user_id: userId,
    },
    include: {
      transaction_items: true,
    },
  });
}

export async function getCurrentTransaction(
  userId: string
): Promise<any | null> {
  // search if current transaction is available
  const currentTransaction = await prisma.transaction.findFirst({
    where: {
      user_id: userId,
      status: 'Unpaid',
    },
  });

  if (!currentTransaction) {
    return null;
  }

  const transactionId = currentTransaction?.id;

  // return transaction items
  return await prisma.transaction_items.findMany({
    where: {
      transaction_id: transactionId,
    },
    select: {
      id: true,
      amount: true,
      subtotal: true,
      transaction: true,
      product: true,
    },
  });
}

export async function increaseItem(itemId: string): Promise<any | null> {
  const item = await prisma.transaction_items.findFirst({
    where: {
      id: itemId,
    },
  });

  if (!item) {
    return null;
  }

  return await prisma.transaction_items.update({
    where: {
      id: itemId,
    },
    data: {
      amount: item.amount + 1,
    },
  });
}

export async function decreaseItem(itemId: string): Promise<any | null> {
  const item = await prisma.transaction_items.findFirst({
    where: {
      id: itemId,
    },
  });

  if (!item) {
    return null;
  }

  return await prisma.transaction_items.update({
    where: {
      id: itemId,
    },
    data: {
      amount: item.amount - 1,
    },
  });
}

export async function removeTransactionItem(
  itemId: string
): Promise<any | null> {
  return await prisma.transaction_items.delete({
    where: {
      id: itemId,
    },
  });
}
