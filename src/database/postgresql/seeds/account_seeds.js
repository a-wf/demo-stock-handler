'use strict';

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('accounts')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('accounts').insert([
        { id: 1, username: 'accountA' },
        { id: 2, username: 'accountB' },
        { id: 3, username: 'accountC' }
      ]);
    });
};
