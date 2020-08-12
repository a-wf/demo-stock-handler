'use strict';

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('accounts')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('accounts').insert([{ username: 'accountA' }, { username: 'accountB' }, { username: 'accountC' }]);
    });
};
