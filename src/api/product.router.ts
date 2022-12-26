import { Router, Request, Response } from 'express';
import { prisma } from '../db/client';
import { validate } from './middleware';
import { productCreate, productUpdate } from '../schema/product.schema';

export const productRouter = Router();

// Get all data
productRouter.get('/', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// Get data by ID
productRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.json(product);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// Create a data
productRouter.post('/', validate(productCreate), async (req: Request, res: Response) => {
  try {
    const newProduct = await prisma.product.create({
      data: req.body,
    });
    res.json(newProduct);
  } catch (error: any) {
    res.status(500).send({ error: 'An error occured while creating a product' });
  }
});

// Update a data
productRouter.patch('/:id', validate(productUpdate), async (req: Request, res: Response) => {
  try {
    const updatedProduct = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// Delete a data
productRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });
    res.sendStatus(200);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});
