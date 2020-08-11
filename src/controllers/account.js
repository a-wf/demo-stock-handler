'use strict';

const services = require('../services');
const mongoose = require('mongoose');

/**
 * Add new account - express controller
 * @return {PromiseFunction} (req, res, next) => {}
 */
function addAccount() {
  return async (req, res, next) => {
    try {
      const { username } = req.body;
      if (username) {
        const data = await services.queries.addAccount({ username });
        res.status(200).json({ 'request-id': req.header('X-REQUEST-ID'), data });
      } else {
        res.status(400).send('Bad request');
      }
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Remove account - express controller
 * @return {PromiseFunction} (req, res, next) => {}
 */
function removeAccount() {
  return async (req, res, next) => {
    try {
      const { accountId } = req.params;
      if (mongoose.Types.ObjectId.isValid(accountId)) {
        await services.queries.removeAccount({ accountId });
        res.status(200).json({ 'request-id': req.header('X-REQUEST-ID') });
      } else {
        res.status(400).send('Bad request');
      }
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Get list of holded product of an account - express controller
 * @return {PromiseFunction} (req, res, next) => {}
 */
function getAccountHolds() {
  return async (req, res, next) => {
    try {
      const { accountId } = req.params;
      if (mongoose.Types.ObjectId.isValid(accountId)) {
        const data = await services.queries.getAccountHolds({ accountId });
        res.status(200).json({ 'request-id': req.header('X-REQUEST-ID'), data });
      } else {
        res.status(400).send('Bad request');
      }
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { addAccount, removeAccount, getAccountHolds };
