import { Request, Response, NextFunction } from 'express';
import * as services from '../../services';

/**
 * Add new account - express controller
 * @return {Promise<void>}
 */
async function addAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username } = req.body;
    if (username) {
      const data = await services.queries.addAccount({ username });
      res.status(200).json({ data });
    } else {
      res.status(400).send('Bad request');
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Remove account - express controller
 * @return {Promise<void>}
 */
async function removeAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { accountId } = req.params;
    if (accountId) {
      await services.queries.removeAccount({ accountId });
      res.status(200).end();
    } else {
      res.status(400).send('Bad request');
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Get list of holded product of an account - express controller
 * @return {Promise<void>}
 */
async function getAccountHolds(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { accountId } = req.params;
    if (accountId) {
      const data = await services.queries.getAccountHolds({ accountId });
      res.status(200).json({ data });
    } else {
      res.status(400).send('Bad request');
    }
  } catch (error) {
    next(error);
  }
}

export { addAccount, removeAccount, getAccountHolds };
