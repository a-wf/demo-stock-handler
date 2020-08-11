'use strict';

const express = require('express');
const basicAuth = require('express-basic-auth');
const { server } = require('./../../config');
const router = express.Router();

const { addAccount, removeAccount, getAccountHolds } = require('./account');
const { addProduct, updateProductStock, listProducts } = require('./product');
const { holdProduct, updateCartAmount, moveCart } = require('./action');

const basicAuthObject = {
  users: { ...server.basicAuth }
};

function controllers() {
  router.post('/account', basicAuth(basicAuthObject), addAccount);
  router.delete('/account/:accountId', basicAuth(basicAuthObject), removeAccount);
  router.get('/account/:accountId/products', getAccountHolds);

  router.post('/product', basicAuth(basicAuthObject), addProduct);
  router.patch('/product/:productId', basicAuth(basicAuthObject), updateProductStock);
  router.get('/products', listProducts);

  router.post('/action/hold', holdProduct);
  router.patch('/action/hold', updateCartAmount);
  router.delete('/action/hold', moveCart);

  return router;
}

module.exports = controllers;
