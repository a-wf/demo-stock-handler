import Knex from 'knex';

exports.up = (knex: Knex): Promise<any> => {
  return knex.schema.createTable('accounts', (table: Knex.CreateTableBuilder) => {
    table.increments('id').primary();
    table.string('username').unique();
    table.timestamps(true, true);
  });
};

exports.down = (knex: Knex): Promise<any> => {
  return knex.schema.dropTable('users');
};
