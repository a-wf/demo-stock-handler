import * as db from './../../database/mongodb';
import mongoose from 'mongoose';
import {
  AccountNameInterfaceType,
  AccountOptionalInterfaceType,
  AccountIdInterfaceType,
  CartHolderInterfaceType,
  ProductIdAndAmountInterfaceType,
  AccountInterfaceType,
  CartsInterfaceType,
  ProductInterfaceType,
  CartWithoutIdInterfaceType,
  ProductWithoutIdInterfaceType,
  ProductIdInterfaceType,
  ProductIdAndNameInterfaceType,
  AccountIdProductIdInterfaceType,
  CheckResultHoldThisProduct,
  CartInterfaceType,
  CartHolderAndProductInterfaceType
} from 'param-models';

/**
 * @typedef {object} AccountID
 * @property {string } id account uuid - ObjectId
 */
/**
 * @typedef {object} accountUserName
 * @property {string} username account username
 */
/**
 * add new account to database
 * @param {accountUserName} {username}
 * @return {Promise<AccountID>}
 */
async function addAccount({ username }: AccountNameInterfaceType): Promise<AccountIdInterfaceType> {
  const result = await db.accounts.create({ username });
  return result ? { id: result.id } : null;
}

/**
 * @typedef {object} accountIDUserName
 * @property {string} id account unique id
 * @property {string} username account username
 */
/**
 * find account
 * @param {accountIDUserName} { accountId, username }
 * @return {Promise<accountIDUserName>}
 */
async function findAccount({ id, username }: AccountOptionalInterfaceType): Promise<AccountInterfaceType> {
  // tslint:disable-next-line: no-string-throw
  if (!mongoose.Types.ObjectId.isValid(id)) throw 'Invalid account id';
  const query: any = {};
  if (id) query._id = id;
  if (username) query.username = username;
  const result = await db.accounts.findOne(query);
  return result ? { id: result.id, username: result.username } : null;
}

/**
 * @typedef {object} CartsObject
 * @param {Array<Cart>} carts
 */
/**
 * remove account from database
 * @param {AccountID}
 * @return {Promise<CartsObject>}
 */
async function getAccountByIdAndCarts({ id }: AccountIdInterfaceType): Promise<CartsInterfaceType> {
  const account = await db.accounts.findById({ _id: id }).populate('_accountCart');
  return account ? { carts: account._accountCart } : null;
}

/**
 * @typedef {object} HolderID
 * @property {string } id account uuid - ObjectId
 */
/**
 * remove carts from database by holder
 * @param {HolderID}
 * @return {Promise<void>}
 */
async function deleteCartsByHolder({ holder }: CartHolderInterfaceType): Promise<void> {
  await db.carts.deleteMany({ holder });
}

/**
 * increase or decrease depot product amount
 * @param {ProductIdAndAmount}
 * @return {Promise<Product>}
 */
async function findProductByIdAndUpdateAmount({ id, amount }: ProductIdAndAmountInterfaceType): Promise<ProductInterfaceType> {
  // tslint:disable-next-line: no-string-throw
  if (!mongoose.Types.ObjectId.isValid(id)) throw 'Invalid product id';
  return await db.products.findByIdAndUpdate({ _id: id }, { $inc: { amount } }, { new: true });
}

/**
 * remove account from database by account id
 * @param {AccountID}
 * @return {Promise<boolean>}
 */
async function removeAccountById({ id }: AccountIdInterfaceType): Promise<boolean> {
  // tslint:disable-next-line: no-string-throw
  if (!mongoose.Types.ObjectId.isValid(id)) throw 'Invalid account id';

  const result = await db.accounts.deleteOne({ _id: id });
  return !!result.deletedCount;
}

/**
 * same than AccountID
 * @typedef {object} HolderID
 * @property {string} holder
 */
/**
 * get list of products holded by account from database
 * @param {HolderID} {holder}
 * @return {Promise<Array<ProductIdAndAmount>>}
 */
async function findAllCartsByHolder({ holder }: CartHolderInterfaceType): Promise<CartWithoutIdInterfaceType[]> {
  // tslint:disable-next-line: no-string-throw
  if (!mongoose.Types.ObjectId.isValid(holder)) throw 'Invalid account id';

  const result = await db.carts.find({ holder });
  return result
    ? result.map((obj: CartWithoutIdInterfaceType) => ({ holder: obj.holder.toString(), product: obj.product.toString(), amount: obj.amount }))
    : null;
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
 * @property {string} id
 */
/**
 * get list of products holded by account from database
 * @param {ProductNameAndAmount} {name,amount}
 * @return {Promise<ProductID>}
 */
async function addProduct({ name, amount }: ProductWithoutIdInterfaceType): Promise<ProductIdInterfaceType> {
  const result = await db.products.create({ name, amount });
  return { id: result.id };
}

/**
 *
 * @typedef {object} ProductIdAndAmount
 * @property {string} productId
 * @property {number} amount
 */

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
 * @param {ProductIDName} {id,name}
 * @return {Promise<Array<Product>}
 */
async function findAllProducts({ id, name }: ProductIdAndNameInterfaceType): Promise<ProductInterfaceType[]> {
  const query: any = {};
  if (id) query._id = id;
  if (name) query.name = name;
  const result = await db.products.find(query);
  return result ? result.map((obj: ProductInterfaceType) => ({ id: obj.id.toString(), name: obj.name, amount: obj.amount })) : null;
}

/**
 * @typedef {object} CartWithoutID
 * @property {string} holder
 * @property {string} product
 * @property {number} amount
 */
/**
 * @typedef {object} Cart
 * @property {string} id
 * @property {string} accountId
 * @property {string} productId
 * @property {number} amount
 */

/**
 * @typedef {object} holderAndProductIDs
 * @property {string} accountId
 * @property {string} productId
 */
/**
 * check if the product is holded by the provided accountId
 * @param {holderAndProductIDs}  { accountId, productId }
 */
async function checkProductIfHoldByAccountId({ accountId, productId }: AccountIdProductIdInterfaceType): Promise<CheckResultHoldThisProduct> {
  // tslint:disable-next-line: no-string-throw
  if (!mongoose.Types.ObjectId.isValid(accountId) || !mongoose.Types.ObjectId.isValid(productId)) throw 'Invalid id';
  const account = await db.accounts.findById({ _id: accountId }).populate({ path: '_accountCart', match: { product: productId } });
  if (account) {
    if (account._accountCart.length) {
      return { holdThisProduct: true };
    }
    return { holdThisProduct: false };
  } else {
    // tslint:disable-next-line: no-string-throw
    throw 'Not found account';
  }
}

/**
 * find product by Id and update stock amount if stock is greater than or equal to provided amount
 * @param {ProductIdAndAmount} { id, amount }
 */
async function findProductByIdAndUpdateAmountIfGTE({ id, amount }: ProductIdAndAmountInterfaceType): Promise<ProductInterfaceType> {
  const product = await db.products.findOneAndUpdate({ _id: id, amount: { $gte: amount } }, { $inc: { amount: -1 * amount } }, { new: true });
  return product ? { id: product.id, name: product.name, amount: product.amount } : null;
}

/**
 * add product to a user cart
 * @param {CartWithoutID} {holder,product,amount}
 * @return {Promise<Cart>}
 */
async function holdInCart({ holder, product, amount }: CartWithoutIdInterfaceType): Promise<CartInterfaceType> {
  const result = await db.carts.create({ holder, product, amount });
  return result ? { id: result.id, holder: result.holder, product: result.product, amount: result.amount } : null;
}

/**
 * update quandtity of a product hold by an user by increasing or decreasing an amount
 * @param {CartWithoutID} {holder,product,amount}
 * @return {Promise<Cart>}
 */
async function findCartAndUpdateAmount({ holder, product, amount }: CartWithoutIdInterfaceType): Promise<CartInterfaceType> {
  const newData = await db.carts.findOneAndUpdate({ holder, product }, { $inc: { amount } }, { new: true });
  return newData ? { id: newData.id, holder: newData.holder, product: newData.product, amount: newData.amount } : null;
}

/**
 * find one product based on id and/or name
 * @param ProductIDName { id, name }
 */
async function findProduct({ id, name }: ProductIdAndNameInterfaceType): Promise<ProductIdInterfaceType> {
  // tslint:disable-next-line: no-string-throw
  if (!mongoose.Types.ObjectId.isValid(id)) throw 'Invalid product id';
  const query: any = {};
  if (id) query._id = id;
  if (name) query.name = name;
  const result = await db.products.findOne(query);
  return result ? { id: result.id } : null;
}

/**
 * find all holder by product Id
 * @param {ProductID} { id }
 */
async function findHoldersByProductId({ id }: ProductIdInterfaceType): Promise<AccountInterfaceType[]> {
  const result = await db.carts.find({ product: id }).populate('_account');
  return result ? result.map((cart: { _account?: any[] }) => (cart._account ? cart._account[0] : null)) : null;
}

/**
 *
 * @typedef {object} holderAndProduct
 * @property {string} holder
 * @property {string} product
 */
/**
 * find cart by holder and product
 * @param {holderAndProduct} { holder, product }
 * @return {CartWithoutID}
 */
async function findCart({ holder, product }: CartHolderAndProductInterfaceType): Promise<CartInterfaceType> {
  const cart = await db.carts.findOne({ holder, product });
  return cart ? { id: cart.id, holder: cart.holder, product: cart.product, amount: cart.amount } : null;
}

/**
 * move product out from cart and from stock
 * @param {holderAndProduct} { holder, product }
 */
async function removeCart({ holder, product }: CartHolderAndProductInterfaceType): Promise<boolean> {
  const result = await db.carts.deleteOne({ holder, product });
  return !!result.deletedCount;
}

export {
  addAccount,
  findAccount,
  getAccountByIdAndCarts,
  deleteCartsByHolder,
  findProductByIdAndUpdateAmount,
  removeAccountById,
  findAllCartsByHolder,
  addProduct,
  findAllProducts,
  checkProductIfHoldByAccountId,
  findProductByIdAndUpdateAmountIfGTE,
  holdInCart,
  findCartAndUpdateAmount,
  findProduct,
  findHoldersByProductId,
  findCart,
  removeCart
};
