import { prisma } from '../db/client';

async function updateTotal(transactionId: string): Promise<any | null> {
  // find transaction to update the total
  const items = await prisma.transaction_items.findMany({
    where: {
      transaction_id: transactionId,
    },
  });

  // calculate new total
  const total = items.reduce((acc, item) => acc + item.subtotal, 0);

  // update total
  const updatedTransaction = await prisma.transaction.update({
    where: {
      id: transactionId,
    },
    data: {
      total: total,
    },
  });

  return updatedTransaction;
}

async function updateSubtotal(itemId: string): Promise<any | null> {
  // find item to update the subtotal
  const item = await prisma.transaction_items.findFirst({
    where: {
      id: itemId,
    },
    select: {
      id: true,
      amount: true,
      product: true,
    },
  });

  // update the item subtotal
  const updatedItem = await prisma.transaction_items.update({
    where: {
      id: item?.id,
    },
    data: {
      subtotal: item!.amount * item!.product.price,
    },
  });

  return updateTotal(updatedItem.transaction_id);
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
  const updatedItem = await prisma.transaction_items.update({
    where: {
      id: addedItem!.id,
    },
    data: {
      subtotal: addedItem!.amount * addedItem!.product.price,
    },
  });

  return updateTotal(transaction.id);
}

export async function getAllTransactions(): Promise<any[] | null> {
  return prisma.transaction.findMany({
    include: {
      user: true,
    },
  });
}

export async function statusUnpaid(transactionId: string): Promise<any | null> {
  return changeTransactionStatus(transactionId, 'Unpaid');
}

export async function getWaitingTransaction(
  transactionId: string
): Promise<any | null> {
  return await prisma.transaction.findMany({
    where: {
      status: 'Waiting',
    },
  });
}

export async function statusWaiting(
  transactionId: string
): Promise<any | null> {
  return changeTransactionStatus(transactionId, 'Waiting');
}

export async function statusPaid(
  transactionId: string,
  transactionItems: string
): Promise<any | null> {
  changeTransactionStatus(transactionId, 'Paid');
  return createHistory(transactionId, transactionItems);
}

async function changeTransactionStatus(
  transactionId: string,
  status: string
): Promise<any | null> {
  return await prisma.transaction.update({
    where: {
      id: transactionId,
    },
    data: {
      status: status,
    },
  });
}

export async function getCurrentTransaction(
  userId: string
): Promise<any | null> {
  // search if current transaction is available
  return await prisma.transaction.findFirst({
    where: {
      user_id: userId,
      status: 'Unpaid',
    },
    include: {
      transaction_items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function checkItemStock(itemId: string): Promise<any | null> {
  const item = await prisma.transaction_items.findFirst({
    where: {
      id: itemId,
    },
  });

  const product = await prisma.product.findFirst({
    where: {
      id: item?.product_id,
    },
    select: {
      stock: true,
    },
  });

  return product?.stock;
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

  const updatedItem = await prisma.transaction_items.update({
    where: {
      id: itemId,
    },
    data: {
      amount: item.amount + 1,
    },
  });

  return updateSubtotal(itemId);
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

  const updatedItem = await prisma.transaction_items.update({
    where: {
      id: itemId,
    },
    data: {
      amount: item.amount - 1,
    },
  });

  return updateSubtotal(itemId);
}

export async function removeTransactionItem(
  itemId: string
): Promise<any | null> {
  const item = await prisma.transaction_items.delete({
    where: {
      id: itemId,
    },
  });

  updateTotal(item.transaction_id);

  return item;
}

export async function checkOut(transactionId: string): Promise<any | null> {
  const items = await prisma.transaction_items.findMany({
    where: {
      transaction: {
        id: transactionId,
      },
    },
  });

  items.forEach(
    async (item) =>
      await prisma.$queryRaw`UPDATE product SET stock = (stock - ${item.amount}) WHERE id = ${item.product_id}`
  );

  const currentTime = new Date();
  const dateTime = currentTime.toISOString();

  const updatedTransaction = await prisma.transaction.update({
    where: {
      id: transactionId,
    },
    data: {
      status: 'Waiting',
      created_at: dateTime,
    },
  });

  return updatedTransaction;
}

async function createHistory(
  transaction: any,
  items: string
): Promise<any | null> {
  return await prisma.transaction_history.create({
    data: {
      user: {
        connect: {
          id: transaction.user_id,
        },
      },
      status: transaction.status,
      total: transaction.total,
      transaction_items: items,
      created_at: transaction.created_at,
    },
  });
}

export async function getHistory(userId: string): Promise<any | null> {
  const history = await prisma.transaction_history.findMany({
    where: {
      user_id: userId,
    },
  });

  const sendHistory = history.map((h) => {
    return {
      id: h.id,
      user_id: h.user_id,
      status: h.status,
      total: h.total,
      transaction_items: JSON.parse(h.transaction_items),
      created_at: h.created_at,
    };
  });

  return sendHistory;
}
