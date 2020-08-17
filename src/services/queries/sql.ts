import db from './../../database/postgresql';
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
import Product from '../../database/postgresql/objection/product';
import Account from '../../database/postgresql/objection/account';
import Cart from '../../database/postgresql/objection/cart';
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
  const result: Account = await db.Account.query().allowGraph('username').insertGraph({ username }, { allowRefs: true });
  return result ? { id: result.id.toString() } : null;
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
  let result: Account | Account[];
  if (id) {
    result = await db.Account.query().findById(id);
  } else if (username) {
    result = await db.Account.query().findOne({ username });
  } else {
    result = await db.Account.query();
  }
  return Array.isArray(result)
    ? { id: result[0].id.toString(), username: result[0].username }
    : { id: result.id.toString(), username: result.username };
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
  const account = await db.Account.query().findById(id);

  const carts: Cart[] = await db.Cart.query().where('holder', id);

  return account
    ? {
        carts: carts.map(obj => {
          return { id: obj.id, holder: obj.holder, product: obj.product, amount: obj.amount };
        })
      }
    : null;
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
  await db.Cart.query().delete().where('holder', holder);
}

/**
 * increase or decrease depot product amount
 * @param {ProductIdAndAmount}
 * @return {Promise<Product>}
 */
async function findProductByIdAndUpdateAmount({ id, amount }: ProductIdAndAmountInterfaceType): Promise<ProductInterfaceType> {
  const result = await db.Product.query().increment('amount', amount).where('id', id).returning('*'); // knex methods
  return result && result.length ? { id: result[0].id.toString(), name: result[0].name, amount: result[0].amount } : null;
}

/**
 * remove account from database by account id
 * @param {AccountID}
 * @return {Promise<boolean>}
 */
async function removeAccountById({ id }: AccountIdInterfaceType): Promise<boolean> {
  const result = await db.Account.query().deleteById(id);

  return !!result;
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
  const result = await db.Cart.query().where('holder', holder);

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
  const result = await db.Product.query().allowGraph(['name', 'amount']).insertGraph({ name, amount }, { allowRefs: true });

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
  let result;
  if (id) {
    result = [await db.Product.query().findById(id)];
  } else if (name) {
    result = await db.Product.query().select('name').where('name', name);
  } else {
    result = await db.Product.query();
  }

  return result && result.length ? result.map((obj: ProductInterfaceType) => ({ id: obj.id.toString(), name: obj.name, amount: obj.amount })) : null;
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
  const account = await db.Account.query().findById(accountId);
  const carts = await account.$relatedQuery('carts').where('product', productId);
  // const cart = await db.Cart.query().where('holder', accountId).where('product', productId);
  if (account) {
    if (carts.length) {
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
  const result = await db.Product.query()
    .where('id', id)
    .where('amount', '>=', amount)
    .increment('amount', -1 * amount)
    .returning('*'); // knex methods

  return result && result.length ? { id: result[0].id.toString(), name: result[0].name, amount: result[0].amount } : null;
}

/**
 * add product to a user cart
 * @param {CartWithoutID} {holder,product,amount}
 * @return {Promise<Cart>}
 */
async function holdInCart({ holder, product, amount }: { holder: number; product: number; amount: number }): Promise<CartInterfaceType> {
  const result: Cart = await db.Cart.query()
    .allowGraph(['holder', 'product', 'amount'])
    .insertGraph({ holder, product, amount }, { allowRefs: true });

  return result ? { id: result.id.toString(), holder: result.holder.toString(), product: result.product.toString(), amount: result.amount } : null;
}

/**
 * update quandtity of a product hold by an user by increasing or decreasing an amount
 * @param {CartWithoutID} {holder,product,amount}
 * @return {Promise<Cart>}
 */
async function findCartAndUpdateAmount({ holder, product, amount }: CartWithoutIdInterfaceType): Promise<CartInterfaceType> {
  const result = await db.Cart.query().increment('amount', amount).where('holder', holder).where('product', product).returning('*');

  return result && result.length
    ? { id: result[0].id.toString(), holder: result[0].holder.toString(), product: result[0].product.toString(), amount: result[0].amount }
    : null;
}

/**
 * find one product based on id and/or name
 * @param ProductIDName { id, name }
 */
async function findProduct({ id, name }: ProductIdAndNameInterfaceType): Promise<ProductIdInterfaceType> {
  let result: Product;
  if (id) {
    result = await db.Product.query().findById(id);
  } else if (name) {
    result = await db.Product.query().findOne({ name });
  }
  return result ? { id: result.id.toString() } : null;
}

/**
 * find all holder by product Id
 * @param {ProductID} { id }
 */
async function findHoldersByProductId({ id }: ProductIdInterfaceType): Promise<AccountInterfaceType[]> {
  const result: Account[] | any = await db.Cart.relatedQuery('accounts').where('product', id);
  return result && result.length
    ? result.map((obj: AccountInterfaceType) => {
        return { id: obj.id, username: obj.username };
      })
    : null;
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
  const result = await db.Cart.query().findOne({ holder, product });
  return result ? { id: result.id.toString(), holder: result.holder.toString(), product: result.product.toString(), amount: result.amount } : null;
}

/**
 * move product out from cart and from stock
 * @param {holderAndProduct} { holder, product }
 */
async function removeCart({ holder, product }: CartHolderAndProductInterfaceType): Promise<boolean> {
  const result = await db.Cart.query().delete().where('holder', holder).where('product', product);
  return !!result;
}

export default {
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
