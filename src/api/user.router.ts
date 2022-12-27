import { Router, Request, Response } from 'express';
import { authenticate } from './middleware';

export const userRouter = Router();

// check user or admin
userRouter.get('/check', authenticate());
