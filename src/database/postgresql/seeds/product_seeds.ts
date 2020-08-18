import Knex from 'knex';

exports.seed = (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex('products')
    .del()
    .then(
      (): Promise<any> => {
        // Inserts seed entries
        return knex('products').insert([
          { name: 'product1', amount: 50 },
          { name: 'product2', amount: 100 },
          { name: 'product3', amount: 35 }
        ]);
      }
    );
};
