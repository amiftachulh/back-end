import { Router, Request, Response } from 'express';
import {
  getAllTransactions,
  getCurrentTransaction,
  addToCart,
  increaseItem,
  decreaseItem,
  removeTransactionItem,
  checkItemStock,
  checkOut,
  getHistory,
  statusUnpaid,
  statusWaiting,
  statusPaid,
  getWaitingTransaction,
} from '../service/transaction.service';
import { itemAmount } from '../schema/transaction.shcema';
import { authenticate, validate } from './middleware';

export const transactionRouter = Router();

// get all transaction
transactionRouter.get(
  '/',
  // authenticate(),
  async (req: Request, res: Response) => {
    const payload = await getAllTransactions();
    if (!payload) {
      return res.status(404).send('There are no transactions!');
    }
    return res.status(201).send(payload);
  }
);

// set status of transaction by id
transactionRouter.post(
  '/unpaid/:id',
  authenticate(),
  async (req: Request, res: Response) => {
    const transactionId = req.params.id;
    const payload = await statusUnpaid(transactionId);
    if (!payload) {
      return res.status(404);
    }
    return res.status(201).send('Success');
  }
);

transactionRouter.get(
  '/waiting/:id',
  authenticate(),
  async (req: Request, res: Response) => {
    const transactionId = req.params.id;
    const payload = await getWaitingTransaction(transactionId);
    if (!payload) {
      return res.status(404);
    }
    return res.status(201).send(payload);
  }
);

transactionRouter.post(
  '/waiting/:id',
  authenticate(),
  async (req: Request, res: Response) => {
    const transactionId = req.params.id;
    const payload = await statusWaiting(transactionId);
    if (!payload) {
      return res.status(404);
    }
    return res.status(201).send('Success');
  }
);

transactionRouter.post(
  '/paid/:id',
  authenticate(),
  async (req: Request, res: Response) => {
    const transactionId = req.params.id;
    const transactionItems = req.body.transactionItems;
    const payload = await statusPaid(transactionId, transactionItems);
    if (!payload) {
      return res.status(404);
    }
    return res.status(201).send('Success');
  }
);

// get current transaction by user id and its content
transactionRouter.get(
  '/item/:userId',
  authenticate(),
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const currentTransaction = await getCurrentTransaction(userId);
    if (!currentTransaction) {
      return res.status(404).send('There are no current transaction!');
    }
    return res.status(201).send(currentTransaction);
  }
);

// add item to cart
transactionRouter.post(
  '/',
  authenticate(),
  validate(itemAmount),
  async (req: Request, res: Response) => {
    const payload = req.body;
    const transaction = await addToCart(payload);
    if (!transaction) {
      return res.status(409).send('Item is already in the cart!');
    }
    return res.status(201).send('Success');
  }
);

// edit item amount
transactionRouter.patch(
  '/item-increase/:itemId',
  authenticate(),
  async (req: Request, res: Response) => {
    const itemId = req.params.itemId;
    const amount = req.body.amount;
    const currentStock = await checkItemStock(itemId);
    if (amount >= currentStock) {
      return res.status(400).send({
        stock: currentStock,
        message: 'Must not exceed the stock quantity!',
      });
    }
    const updatedItem = await increaseItem(itemId);
    if (!updatedItem) {
      return res.status(400);
    }
    return res.status(201).send('Item increased');
  }
);

transactionRouter.patch(
  '/item-decrease/:itemId',
  authenticate(),
  async (req: Request, res: Response) => {
    const itemId = req.params.itemId;
    const amount = req.body.amount;
    if (amount <= 1) {
      return res
        .status(400)
        .send(
          'You cannot decrease the item to 0, please use the trash button!'
        );
    }
    const updatedItem = await decreaseItem(itemId);
    if (!updatedItem) {
      return res.status(400);
    }
    return res.status(201).send('Increase decreased');
  }
);

// delete item from cart
transactionRouter.delete(
  '/item/:itemId',
  authenticate(),
  async (req: Request, res: Response) => {
    const itemId = req.params.itemId;
    const deletedItem = await removeTransactionItem(itemId);
    if (!deletedItem) {
      return res.status(400);
    }
    return res.status(201).send('Item deleted');
  }
);

// checkout
transactionRouter.patch(
  '/checkout/:id',
  authenticate(),
  async (req: Request, res: Response) => {
    const transactionId = req.params.id;
    const payload = await checkOut(transactionId);
    if (!payload) {
      return res.status(400);
    }
    return res.status(201).send('Success');
  }
);

// get history
transactionRouter.get(
  '/history/:id',
  authenticate(),
  async (req: Request, res: Response) => {
    const userId = req.params.id;
    const payload = await getHistory(userId);
    if (!payload) {
      return res.status(404).send('There are no transaction!');
    }
    return res.status(201).send(payload);
  }
);
