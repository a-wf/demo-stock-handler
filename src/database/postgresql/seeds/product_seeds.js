'use strict';

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('products')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('products').insert([
        { name: 'product1', amount: 50 },
        { name: 'product2', amount: 100 },
        { name: 'product3', amount: 35 }
      ]);
    });
};
