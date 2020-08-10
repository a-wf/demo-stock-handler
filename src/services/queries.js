'use strict';

const db = require('./../database');
const { logger } = require('./../libs/logger');

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
    const result = await db.accounts.create({ username });
    logger.Info('Queries', 'addAccount', `Add new account: ${JSON.stringify(result)}`);
    return { accountId: result.id };
  } catch (error) {
    if (error.message.includes('E11000 duplicate key')) throw 'username already exists';
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
 * add new account to database
 * @param {accountIDUserName} {username}
 * @return {Promise<AccountID>}
 */
async function getAccount({ accountId, username }) {
  const query = {};
  if (accountId) query._id = accountId;
  if (username) query.username = username;
  const result = await db.accounts.findOne(query);
  if (!result) throw 'Not found account';
  return { id: result.id, username: result.username };
}

/**
 *
 * @typedef {object} AccountID
 * @property {string } accountId account uuid - ObjectId
 */
/**
 * remove account from database
 * @param {AccountID} {accountId}
 * @return {Promise<void>}
 */
async function removeAccount({ accountId }) {
  const account = await db.accounts.findById({ _id: accountId }).populate('_accountCart');
  if (account) {
    if (account._accountCart.length) {
      await Promise.all(
        account._accountCart.map(async (element) => {
          await db.carts.deleteMany({ holder: accountId });
          const product = await db.products.findByIdAndUpdate({ _id: element.product }, { $inc: { amount: element.amount } }, { new: true });
          logger.Info('Queries', 'removeAccount', `remaining ${product.amount} products ${product.id} in stock`);
        })
      );
    }
    const result = await db.accounts.deleteOne({ _id: accountId });
    if (result.deletedCount) {
      logger.Info('Queries', 'removeAccount', `account ${accountId} removed`);
    } else {
      throw new Error('failed to remove account ${accountId}');
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
  const result = await db.carts.find({ holder: accountId });

  logger.Info('Queries', 'getAccountHolds', `get account's holded products: ${JSON.stringify(result)}`);
  return result.map(({ product, amount }) => ({ product, amount }));
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
    const result = await db.products.create({ name, amount });
    logger.Info('Queries', 'addProduct', `add new products: ${JSON.stringify(result)}`);
    return { productId: result.id };
  } catch (error) {
    if (error.message.includes('E11000 duplicate key')) throw 'product collection already exists';
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
 * @return {Promise<void>}
 */
async function updateProductStock({ productId, amount }) {
  const found = await db.products.findOneAndUpdate({ _id: productId }, { $inc: { amount } }, { new: true });
  if (found) {
    logger.Info('Queries', 'updateProductStock', `update product stock: ${JSON.stringify(found)}`);
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
  const query = {};
  if (productId) query._id = productId;
  if (name) query.name = name;
  const result = await db.products.find(query);
  if (!result.length) throw 'Empty depot or found product';
  logger.Info('Queries', 'listProducts', `available stock: ${JSON.stringify(result)}`);
  return result.map(({ id, name, amount }) => ({ id, name, amount }));
}

/**
 * @typedef {object} Cart
 * @property {string} accountId
 * @property {productId} productId
 * @property {number} amount
 */
/**
 * add product to a user cart
 * @param {Cart} {accountId,productId,amount}
 * @return {Promise<void>}
 */
async function holdProduct({ accountId, productId, amount }) {
  const account = await db.accounts.findById({ _id: accountId }).populate({ path: '_accountCart', match: { product: productId } });
  if (account) {
    if (!account._accountCart.length) {
      const product = await db.products.findOneAndUpdate(
        { _id: productId, amount: { $gte: amount } },
        { $inc: { amount: -1 * amount } },
        { new: true }
      );
      if (product) {
        await db.carts.create({ holder: accountId, product: productId, amount });
        logger.Info('Queries', 'holdProduct', `account ${accountId} holds ${amount} products ${productId}`);
        logger.Info('Queries', 'holdProduct', `remaining ${product.amount} products ${productId} in stock`);
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
 * @return {Promise<void>}
 */
async function updateCartAmount({ accountId, productId, amount }) {
  const account = await db.accounts.findById({ _id: accountId }).populate({ path: '_accountCart', match: { product: productId } });
  if (account) {
    if (account._accountCart.length) {
      const product = await db.products.findOneAndUpdate(
        { _id: productId, amount: { $gte: amount } },
        { $inc: { amount: -1 * amount } },
        { new: true }
      );
      if (product) {
        const newData = await db.carts.findOneAndUpdate({ holder: accountId, product: productId }, { $inc: { amount } }, { new: true });
        logger.Info('Queries', 'updateCartAmount', `account ${accountId} holds ${newData.amount} products ${productId}`);
        logger.Info('Queries', 'updateCartAmount', `remaining ${product.amount} products of ${product.name} (${productId}) in stock`);
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

async function getProductHolders({ productId, name }) {
  const query = {};
  if (productId) query._id = productId;
  if (name) query.name = name;
  const found = await db.products.findOne({ query });
  if (found) {
    const result = await db.carts.find({ product: found.id }).populate('_account');
    return result._account;
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
 */
async function moveCart({ accountId, productId }) {
  const account = await db.accounts.findById({ _id: accountId });
  if (account) {
    const product = await db.products.findById({ _id: productId });
    if (product) {
      const cart = await db.carts.findOne({ holder: accountId, product: productId });
      if (cart) {
        await db.carts.deleteOne({ holder: accountId, product: productId });
        logger.Info('Queries', 'holdProduct', `account ${accountId} move out holded products ${product.name} ${productId}`);
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
  moveCart
};
