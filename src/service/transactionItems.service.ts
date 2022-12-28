import { prisma } from '../db/client';

export async function addToCart(payload: any): Promise<any | null> {
  // search if transaction is already in db
  let transaction = await prisma.transaction.findFirst({
    where: {
      userId: payload.userId,
      status: 'Unpaid',
    },
  });

  // create transaction
  if (!transaction) {
    transaction = await prisma.transaction.create({
      data: {
        userId: payload.userId,
      },
    });
  }

  // check item if already in the cart
  let item = await prisma.transactionItems.findFirst({
    where: {
      productId: payload.productId,
      transactionId: transaction.id,
    },
  });

  // if item already in the card don't add

  // add item to transaction
  const addedItem = await prisma.transactionItems.create({
    data: {
      transactionId: transaction.id,
      productId: payload.productId,
      amount: payload.amount,
    },
  });
  console.log(addedItem);

  return addedItem;
}
