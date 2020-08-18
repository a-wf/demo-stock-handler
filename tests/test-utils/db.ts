import { database } from '../../src/config';
import mongoose, { Connection } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Knex from 'knex';

export interface KnexClient extends Knex<any, unknown[]> {
  close?(): Promise<void>;
}
const mongod = new MongoMemoryServer();

let client: mongoose.Connection;
let connect: { (): Promise<void>; (): void };
let disconnect: (dbclient: KnexClient | Connection) => Promise<void>;
let teardown: { (): Promise<void>; (): void };
const dbType = database.test.client;

switch (dbType) {
  case 'mongodb':
    connect = async () => {
      const uri = await mongod.getConnectionString();
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      });
    };
    client = mongoose.connection;
    disconnect = async () => {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongod.stop();
    };

    teardown = async () => {
      const collections = mongoose.connection.collections;
      for (const key of Object.keys(collections)) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
    };

    break;
  case 'postgresql':
  default:
    // tslint:disable-next-line: no-empty
    connect = async () => {};
    disconnect = async (dbclient: KnexClient | Connection) => {
      dbclient.close();
    };
    // tslint:disable-next-line: no-empty
    teardown = async () => {};
  // connect = async () => {
  //   client = knex({
  //     client: 'postgres',
  //     debug: true,
  //     connection: {
  //       host: 'localhost',
  //       database: 'postgres',
  //       port: '5432',
  //       password: '',
  //       user: ''
  //     }
  //   });
  //   try {
  //     await client.raw(`CREATE DATABASE ${database.test.connection.database}`);
  //   } catch (err) {
  //     // eslint-disable-next-line no-console
  //     console.log(err);
  //   } finally {
  //     await client.destroy();
  //   }
  // };

  // teardown = async () => {
  //   client = knex({
  //     client: 'postgres',
  //     debug: true,
  //     connection: {
  //       host: 'localhost',
  //       database: 'postgres',
  //       port: '5432',
  //       password: '',
  //       user: ''
  //     }
  //   });
  //   try {
  //     await client.raw(`DROP DATABASE IF EXISTS ${database.test.connection.database}`);
  //   } catch (err) {
  //     // eslint-disable-next-line no-console
  //     console.log(err);
  //   }
  // };

  // disconnect = async () => {
  //   await client.destroy();
  // };
}
export default {
  client,
  connect,
  teardown,
  disconnect
};
