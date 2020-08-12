'use strict';

const { database } = require('./../../src/config');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
// const knex = require('knex');

let client, connect, disconnect, teardown;
let dbType = database.test.client;

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

      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
      }
    };

    break;
  case 'postgresql':
  default:
    connect = () => {};
    disconnect = client => {
      client.destroy();
    };
    teardown = () => {};
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

module.exports = {
  client,
  connect,
  teardown,
  disconnect
};
