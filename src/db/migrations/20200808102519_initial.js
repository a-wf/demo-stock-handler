'use strict';

exports.up = async function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id');
      table.string('name');
      table.timestamps(true, true);
    })
    .createTable('stock', (table) => {
      table.increments('id');
      table.string('product');
      table.integer('in_stock');
      table.timestamps(true, true);
    })
    .createTable('holding', (table) => {
      table.increments('id');
      table.integer('owner_id').references('users.id');
      table.integer('product').references('product.id');
      table.string('holding');
      table.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('holding').dropTable('user').dropTable('stock');
};
