import { Router, Request, Response } from 'express';
import { addToCart } from '../service/transactionItems.service';

export const transactionItemRouter = Router();

// add item to cart
transactionItemRouter.post('/', async (req: Request, res: Response) => {
  const payload = req.body;
  const transaction = await addToCart(payload);
  if (!transaction) {
    return res.status(409).send('Item is already in the cart!');
  }
  return res.status(201).send(transaction);
});
