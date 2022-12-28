import { Router, Request, Response } from 'express';
import { getAllTransactions } from '../service/transaction.service';

export const transactionRouter = Router();

// get all transactions data
transactionRouter.get('/', async (req: Request, res: Response) => {
  const transactions = await getAllTransactions();
  if (!transactions) {
    res.sendStatus(400);
  }
  res.status(201).send(transactions);
});

// get transaction by id
transactionRouter.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
});
