import Knex from 'knex';

declare module 'knex-extended-types' {
  export interface KnexClient extends Knex<any, unknown[]> {
    close?(): Promise<void>;
  }
}
