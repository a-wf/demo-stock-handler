import Knex from 'knex';

exports.seed = (knex: Knex): Promise<any> => {
  // Deletes ALL existing entries
  return knex('accounts')
    .del()
    .then(
      (): Promise<any> => {
        // Inserts seed entries
        return knex('accounts').insert([{ username: 'accountA' }, { username: 'accountB' }, { username: 'accountC' }]);
      }
    );
};
