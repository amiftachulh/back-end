import { Router, Request, Response } from 'express';
import {
  getAllTransactions,
  getCurrentTransaction,
  addToCart,
  increaseItem,
  decreaseItem,
  removeTransactionItem,
} from '../service/transaction.service';
import { authenticate } from './middleware';

export const transactionRouter = Router();

// get all transactions by id and its content
transactionRouter.get('/all/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const transactions = await getAllTransactions(userId);
  if (!transactions) {
    return res.send(400);
  }
  return res.status(201).send(transactions);
});

// get current transaction by id and its content
transactionRouter.get('/item/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const currentTransaction = await getCurrentTransaction(userId);
  if (!currentTransaction) {
    return res.status(404).send('There are no current transaction!');
  }
  return res.status(201).send(currentTransaction);
});

// add item to cart
transactionRouter.post('/', async (req: Request, res: Response) => {
  const payload = req.body;
  const transaction = await addToCart(payload);
  if (!transaction) {
    return res.status(409).send('Item is already in the cart!');
  }
  return res.status(201).send(transaction);
});

// edit item amount
transactionRouter.patch(
  '/item-increase/:itemId',
  async (req: Request, res: Response) => {
    const itemId = req.params.itemId;
    const updatedItem = await increaseItem(itemId);
    if (!updatedItem) {
      return res.status(400);
    }
    return res.status(201).send(updatedItem);
  }
);

transactionRouter.patch(
  '/item-decrease/:itemId',
  async (req: Request, res: Response) => {
    const itemId = req.params.itemId;
    const updatedItem = await decreaseItem(itemId);
    if (!updatedItem) {
      return res.status(400);
    }
    return res.status(201).send(updatedItem);
  }
);

// delete item from cart
transactionRouter.delete(
  'item/:itemId',
  async (req: Request, res: Response) => {
    const itemId = req.params.itemId;
    const deletedItem = await removeTransactionItem(itemId);
    if (!deletedItem) {
      return res.status(400);
    }
    return res.status(201).send(deletedItem);
  }
);
