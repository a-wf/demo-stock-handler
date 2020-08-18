import { Request, Response, NextFunction } from 'express';
import * as services from '../../services';

/**
 * Add an amount of a product to account's cart - express controller
 * @return {Promise<void>}
 */
async function holdProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { amount } = req.body;
    if (amount <= 0) {
      next('Amount has to be greater than 0');
    } else {
      const accountId: string = typeof req.query.accountId === 'string' ? req.query.accountId : undefined;
      const productId: string = typeof req.query.productId === 'string' ? req.query.productId : undefined;
      if (amount && accountId && productId) {
        await services.queries.holdProduct({ amount, accountId, productId });
        res.status(200).end();
      } else {
        res.status(400).send('Bad request');
      }
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Update quantity of a product to account's cart by increassing or decreasing a ammount - express controller
 * @return {Promise<void>}
 */
async function updateCartAmount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { amount } = req.body;
    const accountId: string = typeof req.query.accountId === 'string' ? req.query.accountId : undefined;
    const productId: string = typeof req.query.productId === 'string' ? req.query.productId : undefined;
    if (accountId && productId) {
      await services.queries.updateCartAmount({ amount, accountId, productId });
      res.status(200).end();
    } else {
      res.status(400).send('Bad request');
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Move out the holded product from account cart and from stock - express controller
 * @return {Promise<void>}
 */
async function moveCart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const accountId: string = typeof req.query.accountId === 'string' ? req.query.accountId : undefined;
    const productId: string = typeof req.query.productId === 'string' ? req.query.productId : undefined;
    if (accountId && productId) {
      await services.queries.moveCart({ accountId, productId });
      res.status(200).end();
    } else {
      res.status(400).send('Bad request');
    }
  } catch (error) {
    next(error);
  }
}

export { holdProduct, updateCartAmount, moveCart };
