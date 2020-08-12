'use strict';

exports.up = function (knex) {
  return knex.schema.createTable('products', table => {
    table.increments('id').primary();
    table.string('name');
    table.integer('amount');
    table.timestamps(true, true);
    table.unique('name');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('products');
};
