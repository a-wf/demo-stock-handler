'use strict';

const Knex = require('knex');
const config = require('../knexfile');
const { Model } = require('objection');

const client = Knex(config);

Model.knex(client);

class Account extends Model {
  static get tableName() {
    return 'accounts';
  }

  static get relationMappings() {
    return {
      carts: {
        relation: Model.HasManyRelation,
        modelClass: Cart,
        join: {
          from: 'accounts.id',
          to: 'carts.holder'
        }
      }
    };
  }
}

class Product extends Model {
  static get tableName() {
    return 'products';
  }

  static get relationMappings() {
    return {
      carts: {
        relation: Model.HasManyRelation,
        modelClass: Cart,
        join: {
          from: 'product.id',
          to: 'carts.product'
        }
      }
    };
  }
}

class Cart extends Model {
  static get tableName() {
    return 'carts';
  }

  static get relationMappings() {
    return {
      accountId: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'carts.holder',
          to: 'accounts.id'
        }
      },
      productId: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'carts.product',
          to: 'products.id'
        }
      }
    };
  }
}

client.close = client.destroy;
module.exports = { client, Account, Product, Cart };
