import { Router, Request, Response } from 'express';
import { prisma } from '../db/client';
import { validate } from './middleware';
import {
  ProductCreate,
  productCreate,
  ProductUpdate,
  productUpdate,
} from '../schema/product.schema';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../service/product.service';

export const productRouter = Router();

// Get all data
productRouter.get('/', async (req: Request, res: Response) => {
  const products = await getAllProducts();
  if (!products) {
    return res.status(400);
  }
  return res.status(201).send(products);
});

// Get data by ID
productRouter.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const product = await getProductById(id);
  if (!product) {
    return res.status(400);
  }
  return res.status(201).send(product);
});

// Create a data
productRouter.post(
  '/',
  validate(productCreate),
  async (req: Request, res: Response) => {
    const payload = req.body as ProductCreate;
    const product = await createProduct(payload);
    if (!product) {
      return res.status(400);
    }
    return res.status(201).send(product);
  }
);

// Update a data
productRouter.patch(
  '/:id',
  validate(productUpdate),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = req.body as ProductUpdate;
    const updatedProduct = await updateProduct(id, payload);
    if (!updatedProduct) {
      return res.status(400);
    }
    return res.status(201).send(updatedProduct);
  }
);

// Delete a data
productRouter.delete('/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const deletedProduct = await deleteProduct(id);
  if (!deletedProduct) {
    return res.status(400);
  }
  return res.status(201).send(deletedProduct);
});
