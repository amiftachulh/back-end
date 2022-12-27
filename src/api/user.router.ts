import { Router, Request, Response } from 'express';
import { userUpdate } from '../schema/user.schema';
import {
  authenticate,
  adminAuth,
  AuthorizedRequest,
  validate,
} from './middleware';
import { prisma } from '../db/client';
import { request } from 'http';

export const userRouter = Router();

// example update endpoint with payload validation and authentication
userRouter.put(
  '/',
  authenticate(), // only authorized users
  validate(userUpdate), // validate request body
  async (req: Request, res: Response) => {
    const user = (req as AuthorizedRequest).user;
    const result = await prisma.user.update({
      where: { id: user.id },
      data: req.body,
    });
    return res.status(200).send(result);
  }
);

// check if user is authorized
userRouter.get(
  '/check',
  authenticate(),
  async (req: Request, res: Response) => {
    res.json({ message: 'User is authorized!' });
  }
);

// check if user is admin
userRouter.get(
  '/admin',
  authenticate(),
  adminAuth(),
  async (req: Request, res: Response) => {
    res.json({ message: 'You are an admin!' });
  }
);
