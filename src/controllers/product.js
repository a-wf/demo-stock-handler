'use strict';

const services = require('../services');
const mongoose = require('mongoose');

/**
 * add new product in stock - express controller
 * @return {PromiseFunction} (req, res, next) => {}
 */
function addProduct() {
  return async (req, res, next) => {
    try {
      const { name, amount } = req.body;
      if (amount <= 0) {
        next('Amount has to be greater than 0');
      } else {
        if (name) {
          const data = await services.queries.addProduct({ name, amount });
          res.status(200).json({ 'request-id': req.header('X-REQUEST-ID'), data });
        } else {
          res.status(400).send('Bad request');
        }
      }
    } catch (error) {
      next(error);
    }
  };
}

/**
 * update the stock of a product by increaseing or descresing an amount - express controller
 * @return {PromiseFunction} (req, res, next) => {}
 */
function updateProductStock() {
  return async (req, res, next) => {
    try {
      const { amount } = req.body;
      const { productId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(productId)) res.status(400).send('Bad request');

      await services.queries.updateProductStock({ productId, amount });
      res.status(200).json({ 'request-id': req.header('X-REQUEST-ID') });
    } catch (error) {
      next(error);
    }
  };
}

/**
 * list all products in stock - express controller
 * @return {PromiseFunction} (req, res, next) => {}
 */
function listProducts() {
  return async (req, res, next) => {
    try {
      const data = await services.queries.listProducts();
      res.status(200).json({ 'request-id': req.header('X-REQUEST-ID'), data });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { addProduct, updateProductStock, listProducts };
