import { Request, Response, NextFunction } from 'express';
import * as services from '../../services';

/**
 * add new product in stock - express controller
 * @return {Promise<void>}
 */
async function addProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, amount } = req.body;
    if (amount <= 0) {
      next('Amount has to be greater than 0');
    } else {
      if (name) {
        const data = await services.queries.addProduct({ name, amount });
        res.status(200).json({ data });
      } else {
        res.status(400).send('Bad request');
      }
    }
  } catch (error) {
    next(error);
  }
}

/**
 * update the stock of a product by increaseing or descresing an amount - express controller
 * @return {Promise<void>}
 */
async function updateProductStock(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { amount } = req.body;
    const { productId } = req.params;
    if (!productId) res.status(400).send('Bad request');

    await services.queries.updateProductStock({ productId, amount });
    res.status(200).end();
  } catch (error) {
    next(error);
  }
}

/**
 * list all products in stock - express controller
 * @return {Promise<void>}
 */
async function listProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await services.queries.listProducts({});
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

export { addProduct, updateProductStock, listProducts };
