import { Router } from 'express';
import { authRouter } from './auth.router';
import { userRouter } from './user.router';
import { productRouter } from './product.router';
import { transactionRouter } from './transaction.router';
import { transactionItemRouter } from './transactionItems.router';

export const indexRouter = Router();

indexRouter.use('/user', userRouter);
indexRouter.use('/auth', authRouter);
indexRouter.use('/product', productRouter);
indexRouter.use('/transaction', transactionRouter);
indexRouter.use('/item', transactionItemRouter);
