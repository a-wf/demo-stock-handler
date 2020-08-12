'use strict';

exports.up = function (knex) {
  return knex.schema.createTable('carts', table => {
    table.increments('id').primary();
    table.integer('holder').references('accounts.id');
    table.integer('product').references('products.id');
    table.integer('amount');
    table.timestamps(true, true);
    table.unique(['holder', 'product']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('cart');
};
