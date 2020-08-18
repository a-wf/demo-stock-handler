import express from 'express';
import basicAuth from 'express-basic-auth';
import { server } from './../../config';
const router = express.Router();

import { addAccount, removeAccount, getAccountHolds } from './account';
import { addProduct, updateProductStock, listProducts } from './product';
import { holdProduct, updateCartAmount, moveCart } from './action';

const basicAuthObject = {
  users: {
    [`${server.adminLogin}`]: server.adminPassword
  }
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

export default controllers;
