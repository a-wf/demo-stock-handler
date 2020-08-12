'use strict';

const services = require('../../services');
const mongoose = require('mongoose');

/**
 * add new product in stock - express controller
 * @return {Promise<void>}
 */
async function addProduct(req, res, next) {
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
async function updateProductStock(req, res, next) {
  try {
    const { amount } = req.body;
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) res.status(400).send('Bad request');

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
async function listProducts(req, res, next) {
  try {
    const data = await services.queries.listProducts({});
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

module.exports = { addProduct, updateProductStock, listProducts };
