'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

schema.index({ name: 1 }, { unique: true });

schema.virtual('_accountCart', {
  ref: 'carts',
  localField: '_id',
  foreignField: 'product'
});

const Products = mongoose.model('products', schema);

module.exports = Products;
