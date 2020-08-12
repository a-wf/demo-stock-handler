'use strict';

exports.up = function (knex) {
  return knex.schema.createTable('accounts', table => {
    table.increments('id');
    table.string('username');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
