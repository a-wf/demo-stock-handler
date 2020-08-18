import Knex from 'knex';
import config from '../knexfile';
import { Model } from 'objection';
import { KnexClient } from 'knex-extended-types';
import Account from './account';
import Product from './product';
import Cart from './cart';

const client: KnexClient = Knex(config);

Model.knex(client);

client.close = client.destroy;
export default { client, Account, Product, Cart };
