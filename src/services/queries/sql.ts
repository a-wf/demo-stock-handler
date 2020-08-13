import db from './../../database';

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
async function addAccount({ username }) {
  const result = await db.Account.query().allowGraph('username').insertGraph({ username });
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
async function findAccount({ id, username }) {
  let result;
  if (id) {
    result = await db.Account.query().findById(id);
  } else if (username) {
    result = await db.Account.query().findOne({ username });
  } else {
    result = await db.Account.query();
  }
  return result ? { id: result.id.toString(), username: result.username } : null;
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
async function getAccountByIdAndCarts({ id }) {
  const account = await db.Account.query().findById(id);

  let carts = account.$relatedQuery('carts');

  carts = await db.Account.relatedQuery('carts').for(id);

  carts = await db.Cart.query().where('holder', id);

  return account ? { carts } : null;
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
async function deleteCartsByHolder({ holder }) {
  await db.Cart.query().delete().where('holder', holder);
}

/**
 * increase or decrease depot product amount
 * @param {ProductIdAndAmount}
 * @return {Promise<Product>}
 */
async function findProductByIdAndUpdateAmount({ id, amount }) {
  const result = await db.Product.query().increment('amount', amount).where('id', id).returning('*'); // knex methods
  return result && result.length ? { id: result[0].id.toString(), name: result[0].name, amount: result[0].amount } : null;
}

/**
 * remove account from database by account id
 * @param {AccountID}
 * @return {Promise<boolean>}
 */
async function removeAccountById({ id }) {
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
async function findAllCartsByHolder({ holder }) {
  const result = await db.Cart.query().where('holder', holder);

  return result ? result.map(({ holder, product, amount }) => ({ holder: holder.toString(), product: product.toString(), amount })) : null;
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
async function addProduct({ name, amount }) {
  const result = await db.Product.query().allowGraph(['name', 'amount']).insertGraph({ name, amount });

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
async function findAllProducts({ id, name }) {
  let result;
  if (id) {
    result = [await db.Product.query().findById(id)];
  } else if (name) {
    result = await db.Product.query().select('name').where('name', name);
  } else {
    result = await db.Product.query();
  }

  return result && result.length ? result.map(({ id, name, amount }) => ({ id: id.toString(), name, amount })) : null;
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
async function checkProductIfHoldByAccountId({ accountId, productId }) {
  const account = await db.Account.query().findById(accountId);
  const carts = await account.$relatedQuery('carts').where('product', productId);
  // const cart = await db.Cart.query().where('holder', accountId).where('product', productId);
  if (account) {
    if (carts.length) {
      return { holdThisProduct: true };
    }
    return { holdThisProduct: false };
  } else {
    throw 'Not found account';
  }
}

/**
 * find product by Id and update stock amount if stock is greater than or equal to provided amount
 * @param {ProductIdAndAmount} { id, amount }
 */
async function findProductByIdAndUpdateAmountIfGTE({ id, amount }) {
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
async function holdInCart({ holder, product, amount }) {
  const result = await db.Cart.query().allowGraph(['holder', 'product', 'amount']).insertGraph({ holder, product, amount });

  return result ? { id: result.id.toString(), holder: result.holder.toString(), product: result.product.toString(), amount: result.amount } : null;
}

/**
 * update quandtity of a product hold by an user by increasing or decreasing an amount
 * @param {CartWithoutID} {holder,product,amount}
 * @return {Promise<Cart>}
 */
async function findCartAndUpdateAmount({ holder, product, amount }) {
  const result = await db.Cart.query().increment('amount', amount).where('holder', holder).where('product', product).returning('*');

  return result && result.length
    ? { id: result[0].id.toString(), holder: result[0].holder.toString(), product: result[0].product.toString(), amount: result[0].amount }
    : null;
}

/**
 * find one product based on id and/or name
 * @param ProductIDName { id, name }
 */
async function findProduct({ id, name }) {
  let result;
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
async function findHoldersByProductId({ id }) {
  const result = await db.Cart.relatedQuery('accounts').where('product', id);

  return result ? result : null;
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
async function findCart({ holder, product }) {
  const result = await db.Cart.query().findOne({ holder, product });
  return result ? { id: result.id.toString(), holder: result.holder.toString(), product: result.product.toString(), amount: result.amount } : null;
}

/**
 * move product out from cart and from stock
 * @param {holderAndProduct} { holder, product }
 */
async function removeCart({ holder, product }) {
  const result = await db.Cart.query().delete().where('holder', holder).where('product', product);
  return !!result;
}

module.exports = {
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
