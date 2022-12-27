import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import { prisma } from '../db/client';
import { jwtPayloadSchema } from '../schema/auth.schema';
import { User } from '@prisma/client';

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };

export const authenticate =
  () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      // extract token from header
      const header = req.header('Authorization');
      if (!header) {
        return res.status(401).send('No authorization header found!');
      }
      const token = header.replace('Bearer ', '');
      if (!token) {
        return res.status(401).send('Invalid authorization header!');
      }

      // verify and decode jwt token
      const jwtPayload = jwt.verify(token, config.get('auth.jwtSecret'));
      const verifiedPayload = await jwtPayloadSchema.parseAsync(jwtPayload);

      // get admin from db
      const admin = await prisma.user.findFirst({
        where: { id: verifiedPayload.id, role: 'admin' },
      });

      if (admin !== null) {
        return res
          .status(200)
          .send({ user: { id: admin.id, role: admin.role } });
      }

      // get user from db
      const user = await prisma.user.findUnique({
        where: { id: verifiedPayload.id },
      });
      if (user === null) {
        return res
          .status(404)
          .send(`User with id ${verifiedPayload.id} not found!`);
      }

      // attach user to request object
      return res.status(200).send({ user: { id: user.id } });
    } catch (error) {
      return res.status(400).json(error);
    }
  };
