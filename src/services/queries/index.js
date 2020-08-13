'use strict';

const config = require('./../../config');
const { logger } = require('./../../libs/logger');

let dbQueries;

switch (config.database[config.common.nodeEnv].client) {
  case 'mongodb':
    dbQueries = require('./nosql');
    break;
  case 'postgresql':
  default:
    dbQueries = require('./sql');
}

/**
 *
 * @typedef {object} accountUserName
 * @property {string} username account username
 */
/**
 * add new account to database
 * @param {accountUserName} {username}
 * @return {Promise<AccountID>}
 */
async function addAccount({ username }) {
  try {
    logger.Debug('Queries', 'addAccount', `args: ${JSON.stringify({ username })}`);
    const result = await dbQueries.addAccount({ username });
    logger.Info('Queries', 'addAccount', `Add new account: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    if (error.message.includes('duplicate key')) throw 'username already exists';
    throw error;
  }
}

/**
 *
 * @typedef {object} accountIDUserName
 * @property {string} accountId account unique id
 * @property {string} username account username
 */
/**
 * find account
 * @param {accountIDUserName} {username}
 * @return {Promise<AccountID>}
 */
async function getAccount({ accountId, username }) {
  logger.Debug('Queries', 'getAccount', `args: ${JSON.stringify({ accountId, username })}`);
  const result = await dbQueries.findAccount({ id: accountId, username });
  if (!result) throw 'Not found account';
  return { id: result.id, username: result.username };
}

/**
 *
 * @typedef {object} AccountID
 * @property {string } id account uuid - ObjectId
 */
/**
 * remove account from database
 * @param {AccountID} {accountId}
 * @return {Promise<void>}
 */
async function removeAccount({ accountId }) {
  logger.Debug('Queries', 'removeAccount', `args: ${JSON.stringify({ accountId })}`);
  const account = await dbQueries.getAccountByIdAndCarts({ id: accountId });
  if (account) {
    if (account.carts.length) {
      await Promise.all(
        account.carts.map(async element => {
          await dbQueries.deleteCartsByHolder({ holder: accountId });
          const product = await dbQueries.findProductByIdAndUpdateAmount({ id: element.product, amount: element.amount });
          logger.Info('Queries', 'removeAccount', `remaining ${product.amount} products ${product.id} in stock`);
        })
      );
    }
    const result = await dbQueries.removeAccountById({ id: accountId });
    if (result) {
      logger.Info('Queries', 'removeAccount', `account ${accountId} removed`);
    } else {
      throw new Error(`failed to remove account ${accountId}`);
    }
  } else {
    throw 'Not found account';
  }
}

/**
 * get list of products holded by account from database
 * @param {AccountID} {accountId}
 * @return {Promise<Array<ProductIdAndAmount>>}
 */
async function getAccountHolds({ accountId }) {
  logger.Debug('Queries', 'getAccountHolds', `args: ${JSON.stringify({ accountId })}`);
  const result = await dbQueries.findAllCartsByHolder({ holder: accountId });
  logger.Info('Queries', 'getAccountHolds', `get account's holded products: ${JSON.stringify(result)}`);
  return result;
}

/**
 *
 * @typedef {object} ProductNameAndAmount
 * @property {string} name
 * @property {number} amount
 */
/**
 *
 * @typedef {object} ProductID
 * @property {string} productId
 */
/**
 * get list of products holded by account from database
 * @param {ProductNameAndAmount} {name,amount}
 * @return {Promise<ProductID>}
 */
async function addProduct({ name, amount }) {
  try {
    logger.Debug('Queries', 'addProduct', `args: ${JSON.stringify({ name, amount })}`);
    const result = await dbQueries.addProduct({ name, amount });
    logger.Info('Queries', 'addProduct', `add new products: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    if (error.message.includes('duplicate key')) throw 'product collection already exists';
    throw error;
  }
}

/**
 *
 * @typedef {object} ProductIdAndAmount
 * @property {string} productId
 * @property {number} amount
 */
/**
 * get list of products holded by account from database
 * @param {ProductIdAndAmount} {productId,amount}
 * @return {Promise<Product>}
 */
async function updateProductStock({ productId, amount }) {
  logger.Debug('Queries', 'updateProductStock', `args: ${JSON.stringify({ productId, amount })}`);
  const found = await dbQueries.findProductByIdAndUpdateAmount({ id: productId, amount });
  if (found) {
    logger.Info('Queries', 'updateProductStock', `update product stock: ${JSON.stringify(found)}`);
    return { id: found.id, name: found.name, amount: found.amount };
  } else {
    throw 'Not found product';
  }
}
/**
 * @typedef {object} ProductIDName
 * @property {string} productId
 * @property {string} name
 */
/**
 * @typedef {object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} amount
 */
/**
 * list all products or based on productId or name, from database
 * @param {ProductIDName} {productId,name}
 * @return {Promise<Array<Product>}
 */
async function listProducts({ productId, name }) {
  logger.Debug('Queries', 'listProducts', `args: ${JSON.stringify({ productId, name })}`);
  const result = await dbQueries.findAllProducts({ id: productId, name });
  if (!result.length) throw 'Empty depot or found product';
  logger.Info('Queries', 'listProducts', `available stock: ${JSON.stringify(result)}`);
  return result;
}

/**
 * @typedef {object} CartWithoutID
 * @property {string} accountId
 * @property {productId} productId
 * @property {number} amount
 */
/**
 * @typedef {object} Cart
 * @property {string} id
 * @property {string} accountId
 * @property {productId} productId
 * @property {number} amount
 */
/**
 * add product to a user cart
 * @param {CartWithoutID} {accountId,productId,amount}
 * @return {Promise<Cart>}
 */
async function holdProduct({ accountId, productId, amount }) {
  logger.Debug('Queries', 'holdProduct', `args: ${JSON.stringify({ accountId, productId, amount })}`);
  const account = await dbQueries.checkProductIfHoldByAccountId({ accountId, productId });
  if (account) {
    if (!account.holdThisProduct) {
      const product = await dbQueries.findProductByIdAndUpdateAmountIfGTE({ id: productId, amount });
      if (product) {
        const result = await dbQueries.holdInCart({ holder: accountId, product: productId, amount });
        logger.Info('Queries', 'holdProduct', `account ${accountId} holds ${amount} products ${productId}`);
        logger.Info('Queries', 'holdProduct', `remaining ${product.amount} products ${productId} in stock`);
        return { id: result.id, holder: result.holder, product: result.product, amount: result.amount };
      } else {
        throw 'Not found product or product remaining stock is not enough';
      }
    } else {
      throw 'Account already holds this kind of product, please use PATCH request';
    }
  } else {
    throw 'Not found account';
  }
}

/**
 * update quandtity of a product hold by an user by increasing or decreasing an amount
 * @param {Cart} {accountId,productId,amount}
 * @return {Promise<Cart>}
 */
async function updateCartAmount({ accountId, productId, amount }) {
  logger.Debug('Queries', 'updateCartAmount', `args: ${JSON.stringify({ accountId, productId, amount })}`);
  const account = await dbQueries.checkProductIfHoldByAccountId({ accountId, productId });
  if (account) {
    if (account.holdThisProduct) {
      const product = await dbQueries.findProductByIdAndUpdateAmountIfGTE({ id: productId, amount });
      if (product) {
        const newData = await dbQueries.findCartAndUpdateAmount({ holder: accountId, product: productId, amount });
        logger.Info('Queries', 'updateCartAmount', `account ${accountId} holds ${newData.amount} products ${productId}`);
        logger.Info('Queries', 'updateCartAmount', `remaining ${product.amount} products of ${product.name} (${productId}) in stock`);
        return { id: newData.id, holder: newData.holder, product: newData.product, amount: newData.amount };
      } else {
        throw 'Not found product or product remaining stock is not enough';
      }
    } else {
      throw 'Have to already hold this kind of product, please use POST request';
    }
  } else {
    throw 'Not found account';
  }
}

/**
 * get holders list related to one product
 * @param {ProductIDName} { productId, name }
 */
async function getProductHolders({ id, name }) {
  logger.Debug('Queries', 'getProductHolders', `args: ${JSON.stringify({ id, name })}`);
  const found = await dbQueries.findProduct({ id, name });
  if (found) {
    const result = await dbQueries.findHoldersByProductId({ id: found.id });
    return result;
  } else {
    throw 'Not found product';
  }
}

/**
 *
 * @typedef {object} AccountIDProductID
 * @property {string} accountId
 * @property {string} productId
 */
/**
 * move product out from cart and from stock
 * @param {AccountIDProductID} {accountId,productId}
 * @return {AccountIDProductID} {accountId,productId}
 */
async function moveCart({ accountId, productId }) {
  logger.Debug('Queries', 'moveCart', `args: ${JSON.stringify({ accountId, productId })}`);
  const account = await dbQueries.findAccount({ id: accountId });
  if (account) {
    const product = await dbQueries.findProduct({ id: productId });
    if (product) {
      const cart = await dbQueries.findCart({ holder: accountId, product: productId });
      if (cart) {
        const result = await dbQueries.removeCart({ holder: accountId, product: productId });
        if (result) {
          logger.Info('Queries', 'moveCart', `account ${accountId} move out holded products ${product.name} ${productId}`);
        } else {
          throw new Error(`failed to remove cart for holder :${accountId}  product: ${productId}`);
        }
        return { id: cart.id, holder: cart.holder, product: cart.product, amount: 0 };
      } else {
        throw `account ${accountId} doesn't hold those kind of product ${productId}`;
      }
    } else {
      throw `Not found product ${productId}`;
    }
  } else {
    throw 'Not found account ${accountId}';
  }
}

module.exports = {
  addAccount,
  getAccount,
  removeAccount,
  getAccountHolds,
  addProduct,
  updateProductStock,
  listProducts,
  holdProduct,
  getProductHolders,
  updateCartAmount,
  moveCart,
  dbQueries: config.common.nodeEnv === 'test' ? dbQueries : null
};
