'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  username: {
    type: String,
    required: true
  }
});

schema.index({ username: 1 }, { unique: true });

schema.virtual('_accountCart', {
  ref: 'carts',
  localField: '_id',
  foreignField: 'holder'
});

const Accounts = mongoose.model('accounts', schema);

module.exports = Accounts;
