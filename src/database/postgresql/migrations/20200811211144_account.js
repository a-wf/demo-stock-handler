'use strict';

exports.up = function (knex) {
  return knex.schema.createTable('accounts', table => {
    table.increments('id').primary();
    table.string('username');
    table.timestamps(true, true);
    table.unique('username');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
