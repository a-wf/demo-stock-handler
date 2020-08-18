import Knex from 'knex';

export function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('accounts', (table: Knex.CreateTableBuilder) => {
    table.increments('id').primary();
    table.string('username').unique();
    table.timestamps(true, true);
  });
}

export function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('users');
}
