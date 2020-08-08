'use strict';

const express = require('express');
const basicAuth = require('express-basic-auth');
const { server } = require('./../config');
const router = express.Router();

const { addAccount, removeAccount, getAccountHolds } = require('./account');
const { addProduct, updateProductStock, listProducts } = require('./product');
const { holdProduct, updateCartAmount, moveCart } = require('./action');

const basicAuthObject = {
  users: { ...server.basicAuth }
};

function controllers(database, logger) {
  router.post('/account', basicAuth(basicAuthObject), addAccount(database, logger));
  router.delete('/account/:accountId', basicAuth(basicAuthObject), removeAccount(database, logger));
  router.get('/account/:accountId/products', getAccountHolds(database, logger));

  router.post('/product', basicAuth(basicAuthObject), addProduct(database, logger));
  router.patch('/product/:productId', basicAuth(basicAuthObject), updateProductStock(database, logger));
  router.get('/products', listProducts(database, logger));

  router.post('/action/:accountId/product/:productId', holdProduct(database, logger));
  router.patch('/action/:accountId/product/:productId', updateCartAmount(database, logger));
  router.delete('/action/:accountId/product/:productId', moveCart(database, logger));

  return router;
}

module.exports = controllers;
