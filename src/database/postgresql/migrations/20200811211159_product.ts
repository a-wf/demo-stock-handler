import Knex from 'knex';

exports.up = (knex: Knex): Promise<any> => {
  return knex.schema.createTable('products', (table: Knex.CreateTableBuilder) => {
    table.increments('id').primary();
    table.string('name').unique();
    table.integer('amount');
    table.timestamps(true, true);
  });
};

exports.down = (knex: Knex): Promise<any> => {
  return knex.schema.dropTable('products');
};
