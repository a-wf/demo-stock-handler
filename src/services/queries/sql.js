'use strict';

const db = require('./../../database');

/**
 * @typedef {object} accountUserName
 * @property {string} username account username
 */

/**
 * @typedef {object} accountIDUserName
 * @property {string} accountId account unique id
 * @property {string} username account username
 */

/**
 * @typedef {object} AccountID
 * @property {string } id account uuid - ObjectId
 */

/**
 * @typedef {object} ProductNameAndAmount
 * @property {string} name
 * @property {number} amount
 */
/**
 * @typedef {object} ProductID
 * @property {string} productId
 */

/**
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
 *
 * @typedef {object} AccountIDProductID
 * @property {string} accountId
 * @property {string} productId
 */

module.exports = {
  addAccount,
  findAccount,
  getAccountByIdAndCarts,
  deleteCartsByHolder,
  findProductByIdAndUpdateAmount,
  removeAccountById,
  findAllCartsByHolder,
  addProduct,
  findProductByIdAndUpdateAmount,
  findAllProducts,
  checkProductIfHoldByAccountId,
  findProductByIdAndUpdateAmountIfGTE,
  holdInCart,
  checkProductIfHoldByAccountId,
  findProductByIdAndUpdateAmountIfGTE,
  findCartAndUpdateAmount,
  findProduct,
  findProductHolder,
  findAccount,
  findProduct,
  findCart,
  removeCart
};
