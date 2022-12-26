import { Router } from 'express';
import { authRouter } from './auth.router';
import { userRouter } from './user.router';
import { productRouter } from './product.router';

export const indexRouter = Router();

indexRouter.use('/user', userRouter);
indexRouter.use('/auth', authRouter);
indexRouter.use('/product', productRouter);
