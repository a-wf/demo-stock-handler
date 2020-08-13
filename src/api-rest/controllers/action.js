'use strict';

const services = require('../../services');
const mongoose = require('mongoose');

/**
 * Add an amount of a product to account's cart - express controller
 * @return {Promise<void>}
 */
async function holdProduct(req, res, next) {
  try {
    const { amount } = req.body;
    if (amount <= 0) {
      next('Amount has to be greater than 0');
    } else {
      const { accountId, productId } = req.query;
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
async function updateCartAmount(req, res, next) {
  try {
    const { amount } = req.body;
    const { accountId, productId } = req.query;
    if ((accountId, productId)) {
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
async function moveCart(req, res, next) {
  try {
    const { accountId, productId } = req.query;
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

module.exports = { holdProduct, updateCartAmount, moveCart };
