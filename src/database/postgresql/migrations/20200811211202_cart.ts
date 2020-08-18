import Knex from 'knex';

export function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('carts', (table: Knex.CreateTableBuilder) => {
    table.increments('id').primary();
    table.integer('holder').references('accounts.id');
    table.integer('product').references('products.id');
    table.integer('amount');
    table.timestamps(true, true);
    table.unique(['holder', 'product']);
  });
}

export function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('cart');
}
