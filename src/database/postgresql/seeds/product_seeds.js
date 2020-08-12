'use strict';

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('products')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('products').insert([
        { id: 1, name: 'product1', amount: 50 },
        { id: 2, name: 'product2', amount: 100 },
        { id: 3, name: 'product3', amount: 35 }
      ]);
    });
};
