import config from './../../config';
import { logger } from './../../libs/logger';
import {
  AccountNameInterfaceType,
  AccountIdInterfaceType,
  AccountInterfaceType,
  ProductIdInterfaceType,
  ProductInterfaceType,
  ProductWithoutIdInterfaceType,
  ProductIdAndNameInterfaceType,
  CartInterfaceType,
  AccountIdProductIdInterfaceType,
  CheckResultHoldThisProduct,
  CartWithoutIdInterfaceType,
  CartsInterfaceType
} from 'param-models';

let dbQueries: any;

switch (config.database[config.common.nodeEnv].client) {
  case 'mongodb':
    // tslint:disable-next-line: no-var-requires
    dbQueries = require('./nosql');
    break;
  case 'postgresql':
  default:
    // tslint:disable-next-line: no-var-requires
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
async function addAccount({ username }: AccountNameInterfaceType): Promise<AccountIdInterfaceType> {
  try {
    logger.Debug('Queries', 'addAccount', `args: ${JSON.stringify({ username })}`);
    const result: AccountIdInterfaceType = await dbQueries.addAccount({ username });
    logger.Info('Queries', 'addAccount', `Add new account: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    // tslint:disable-next-line: no-string-throw
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
async function getAccount({ accountId, username }: { accountId: string | number; username: string }): Promise<AccountInterfaceType> {
  logger.Debug('Queries', 'getAccount', `args: ${JSON.stringify({ accountId, username })}`);
  const result: AccountInterfaceType = await dbQueries.findAccount({ id: accountId, username });
  // tslint:disable-next-line: no-string-throw
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
async function removeAccount({ accountId }: { accountId: string | number }): Promise<void> {
  logger.Debug('Queries', 'removeAccount', `args: ${JSON.stringify({ accountId })}`);
  const account: CartsInterfaceType = await dbQueries.getAccountByIdAndCarts({ id: accountId });
  if (account) {
    if (account.carts.length) {
      await Promise.all(
        account.carts.map(async (element: { product: string | number; amount: number }) => {
          await dbQueries.deleteCartsByHolder({ holder: accountId });
          const product = await dbQueries.findProductByIdAndUpdateAmount({ id: element.product, amount: element.amount });
          logger.Info('Queries', 'removeAccount', `remaining ${product.amount} products ${product.id} in stock`);
        })
      );
    }
    const result: boolean = await dbQueries.removeAccountById({ id: accountId });
    if (result) {
      logger.Info('Queries', 'removeAccount', `account ${accountId} removed`);
    } else {
      throw new Error(`failed to remove account ${accountId}`);
    }
  } else {
    // tslint:disable-next-line: no-string-throw
    throw 'Not found account';
  }
}

/**
 * get list of products holded by account from database
 * @param {AccountID} {accountId}
 * @return {Promise<Array<CartWithoutID>>}
 */
async function getAccountHolds({ accountId }: { accountId: string | number }): Promise<CartWithoutIdInterfaceType[]> {
  logger.Debug('Queries', 'getAccountHolds', `args: ${JSON.stringify({ accountId })}`);
  const result: CartWithoutIdInterfaceType[] = await dbQueries.findAllCartsByHolder({ holder: accountId });
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
async function addProduct({ name, amount }: ProductWithoutIdInterfaceType): Promise<ProductIdInterfaceType> {
  try {
    logger.Debug('Queries', 'addProduct', `args: ${JSON.stringify({ name, amount })}`);
    const result: ProductIdInterfaceType = await dbQueries.addProduct({ name, amount });
    logger.Info('Queries', 'addProduct', `add new products: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    // tslint:disable-next-line: no-string-throw
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
async function updateProductStock({ productId, amount }: { productId: number | string; amount: number }): Promise<ProductInterfaceType> {
  logger.Debug('Queries', 'updateProductStock', `args: ${JSON.stringify({ productId, amount })}`);
  const found: ProductInterfaceType = await dbQueries.findProductByIdAndUpdateAmount({ id: productId, amount });
  if (found) {
    logger.Info('Queries', 'updateProductStock', `update product stock: ${JSON.stringify(found)}`);
    return { id: found.id, name: found.name, amount: found.amount };
  } else {
    // tslint:disable-next-line: no-string-throw
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
async function listProducts({ productId, name }: { productId: number | string; name: string }): Promise<ProductInterfaceType[]> {
  logger.Debug('Queries', 'listProducts', `args: ${JSON.stringify({ productId, name })}`);
  const result: ProductInterfaceType[] = await dbQueries.findAllProducts({ id: productId, name });
  // tslint:disable-next-line: no-string-throw
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
async function holdProduct({
  accountId,
  productId,
  amount
}: {
  accountId: string | number;
  productId: string | number;
  amount: number;
}): Promise<CartInterfaceType> {
  logger.Debug('Queries', 'holdProduct', `args: ${JSON.stringify({ accountId, productId, amount })}`);
  const account: CheckResultHoldThisProduct = await dbQueries.checkProductIfHoldByAccountId({ accountId, productId });
  if (account) {
    if (!account.holdThisProduct) {
      const product: ProductInterfaceType = await dbQueries.findProductByIdAndUpdateAmountIfGTE({ id: productId, amount });
      if (product) {
        const result: CartInterfaceType = await dbQueries.holdInCart({ holder: accountId, product: productId, amount });
        logger.Info('Queries', 'holdProduct', `account ${accountId} holds ${amount} products ${productId}`);
        logger.Info('Queries', 'holdProduct', `remaining ${product.amount} products ${productId} in stock`);
        return { id: result.id, holder: result.holder, product: result.product, amount: result.amount };
      } else {
        // tslint:disable-next-line: no-string-throw
        throw 'Not found product or product remaining stock is not enough';
      }
    } else {
      // tslint:disable-next-line: no-string-throw
      throw 'Account already holds this kind of product, please use PATCH request';
    }
  } else {
    // tslint:disable-next-line: no-string-throw
    throw 'Not found account';
  }
}

/**
 * update quandtity of a product hold by an user by increasing or decreasing an amount
 * @param {Cart} {accountId,productId,amount}
 * @return {Promise<Cart>}
 */
async function updateCartAmount({
  accountId,
  productId,
  amount
}: {
  accountId: string | number;
  productId: string | number;
  amount: number;
}): Promise<CartInterfaceType> {
  logger.Debug('Queries', 'updateCartAmount', `args: ${JSON.stringify({ accountId, productId, amount })}`);
  const account: CheckResultHoldThisProduct = await dbQueries.checkProductIfHoldByAccountId({ accountId, productId });
  if (account) {
    if (account.holdThisProduct) {
      const product: ProductInterfaceType = await dbQueries.findProductByIdAndUpdateAmountIfGTE({ id: productId, amount });
      if (product) {
        const newData: CartInterfaceType = await dbQueries.findCartAndUpdateAmount({ holder: accountId, product: productId, amount });
        logger.Info('Queries', 'updateCartAmount', `account ${accountId} holds ${newData.amount} products ${productId}`);
        logger.Info('Queries', 'updateCartAmount', `remaining ${product.amount} products of ${product.name} (${productId}) in stock`);
        return { id: newData.id, holder: newData.holder, product: newData.product, amount: newData.amount };
      } else {
        // tslint:disable-next-line: no-string-throw
        throw 'Not found product or product remaining stock is not enough';
      }
    } else {
      // tslint:disable-next-line: no-string-throw
      throw 'Have to already hold this kind of product, please use POST request';
    }
  } else {
    // tslint:disable-next-line: no-string-throw
    throw 'Not found account';
  }
}

/**
 * get holders list related to one product
 * @param {ProductIDName} { productId, name }
 */
async function getProductHolders({ id, name }: ProductIdAndNameInterfaceType): Promise<AccountInterfaceType> {
  logger.Debug('Queries', 'getProductHolders', `args: ${JSON.stringify({ id, name })}`);
  const found = await dbQueries.findProduct({ id, name });
  if (found) {
    const result: AccountInterfaceType = await dbQueries.findHoldersByProductId({ id: found.id });
    return result;
  } else {
    // tslint:disable-next-line: no-string-throw
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
async function moveCart({ accountId, productId }: AccountIdProductIdInterfaceType): Promise<CartInterfaceType> {
  logger.Debug('Queries', 'moveCart', `args: ${JSON.stringify({ accountId, productId })}`);
  const account: AccountInterfaceType = await dbQueries.findAccount({ id: accountId });
  if (account) {
    const product: ProductInterfaceType = await dbQueries.findProduct({ id: productId });
    if (product) {
      const cart: CartInterfaceType = await dbQueries.findCart({ holder: accountId, product: productId });
      if (cart) {
        const result: boolean = await dbQueries.removeCart({ holder: accountId, product: productId });
        if (result) {
          logger.Info('Queries', 'moveCart', `account ${accountId} move out holded products ${product.name} ${productId}`);
        } else {
          throw new Error(`failed to remove cart for holder :${accountId}  product: ${productId}`);
        }
        return { id: cart.id, holder: cart.holder, product: cart.product, amount: 0 };
      } else {
        // tslint:disable-next-line: no-string-throw
        throw `account ${accountId} doesn't hold those kind of product ${productId}`;
      }
    } else {
      // tslint:disable-next-line: no-string-throw
      throw `Not found product ${productId}`;
    }
  } else {
    // tslint:disable-next-line: no-string-throw
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
