import { Router, Request, Response } from 'express';
import {
  getAllTransactions,
  getUserCurrentTransaction,
  addToCart,
} from '../service/transaction.service';
import { authenticate } from './middleware';

export const transactionRouter = Router();

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
transactionRouter.patch('/item/:id', async (req: Request, res: Response) => {
  const payload = req.body;
});

// get all transactions data
transactionRouter.get('/', async (req: Request, res: Response) => {
  const transactions = await getAllTransactions();
  if (!transactions) {
    return res.send(400);
  }
  return res.status(201).send(transactions);
});

// get transaction by id
transactionRouter.get('/item/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const currentTransaction = await getUserCurrentTransaction(userId);
  if (!currentTransaction) {
    return res.status(404).send('There are no current transaction!');
  }
  return res.status(201).send(currentTransaction);
});
