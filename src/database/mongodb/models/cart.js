'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  holder: {
    type: String,
    required: true
  },
  product: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});
schema.index({ holder: 1, product: 1 }, { unique: true });

schema.virtual('_account', {
  ref: 'accounts',
  localField: 'holder',
  foreignField: '_id'
});

schema.virtual('_product', {
  ref: 'products',
  localField: 'product',
  foreignField: '_id'
});

const Cart = mongoose.model('carts', schema);

module.exports = Cart;
