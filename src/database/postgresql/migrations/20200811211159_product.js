'use strict';

exports.up = function (knex) {
  return knex.schema.createTable('products', table => {
    table.increments('id');
    table.string('name');
    table.integer('amount');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('products');
};
