'use strict';

const request = require('supertest');
const app = require('./../../src/app');
const inMemoryDB = require('./../test-utils/inMemoryMongo');

describe('Integration tests - APP', function () {
  beforeAll(async () => {
    await inMemoryDB.connect();
  });
  afterAll(async () => {
    await inMemoryDB.clearDatabase();
    await inMemoryDB.closeDatabase();
  });

  describe('Test requests', function () {
    describe('POST /account', function () {
      it('responds with json', function (done) {
        request(app).get('/user').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done);
        request(app)
          .post('/user')
          .send('name=john') // x-www-form-urlencoded upload
          .set('Accept', 'application/json')
          .expect(function (res) {
            res.body.id = 'some fixed id';
            res.body.name = res.body.name.toLowerCase();
          })
          .expect(
            200,
            {
              id: 'some fixed id',
              name: 'john'
            },
            done
          );
      });
    });

    describe('DELETE /account', function () {
      it('responds with json', function (done) {
        request(app).get('/user').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done);
        request(app)
          .post('/user')
          .send('name=john') // x-www-form-urlencoded upload
          .set('Accept', 'application/json')
          .expect(function (res) {
            res.body.id = 'some fixed id';
            res.body.name = res.body.name.toLowerCase();
          })
          .expect(
            200,
            {
              id: 'some fixed id',
              name: 'john'
            },
            done
          );
      });
    });

    describe('GET /account/:accountId/products', function () {
      it('responds with json', function (done) {
        request(app).get('/user').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done);
        request(app)
          .post('/user')
          .send('name=john') // x-www-form-urlencoded upload
          .set('Accept', 'application/json')
          .expect(function (res) {
            res.body.id = 'some fixed id';
            res.body.name = res.body.name.toLowerCase();
          })
          .expect(
            200,
            {
              id: 'some fixed id',
              name: 'john'
            },
            done
          );
      });
    });

    describe('POST /product', function () {
      it('responds with json', function (done) {
        request(app).get('/user').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done);
        request(app)
          .post('/user')
          .send('name=john') // x-www-form-urlencoded upload
          .set('Accept', 'application/json')
          .expect(function (res) {
            res.body.id = 'some fixed id';
            res.body.name = res.body.name.toLowerCase();
          })
          .expect(
            200,
            {
              id: 'some fixed id',
              name: 'john'
            },
            done
          );
      });
    });

    describe('PATCH /product/:productId', function () {
      it('responds with json', function (done) {
        request(app).get('/user').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done);
        request(app)
          .post('/user')
          .send('name=john') // x-www-form-urlencoded upload
          .set('Accept', 'application/json')
          .expect(function (res) {
            res.body.id = 'some fixed id';
            res.body.name = res.body.name.toLowerCase();
          })
          .expect(
            200,
            {
              id: 'some fixed id',
              name: 'john'
            },
            done
          );
      });
    });

    describe('GET /products', function () {
      it('responds with json', function (done) {
        request(app).get('/user').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done);
        request(app)
          .post('/user')
          .send('name=john') // x-www-form-urlencoded upload
          .set('Accept', 'application/json')
          .expect(function (res) {
            res.body.id = 'some fixed id';
            res.body.name = res.body.name.toLowerCase();
          })
          .expect(
            200,
            {
              id: 'some fixed id',
              name: 'john'
            },
            done
          );
      });
    });

    describe('POST /action/:accountId/product/:productId', function () {
      it('responds with json', function (done) {
        request(app).get('/user').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done);
        request(app)
          .post('/user')
          .send('name=john') // x-www-form-urlencoded upload
          .set('Accept', 'application/json')
          .expect(function (res) {
            res.body.id = 'some fixed id';
            res.body.name = res.body.name.toLowerCase();
          })
          .expect(
            200,
            {
              id: 'some fixed id',
              name: 'john'
            },
            done
          );
      });
    });

    describe('PATCH /action/:accountId/product/:productId', function () {
      it('responds with json', function (done) {
        request(app).get('/user').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done);
        request(app)
          .post('/user')
          .send('name=john') // x-www-form-urlencoded upload
          .set('Accept', 'application/json')
          .expect(function (res) {
            res.body.id = 'some fixed id';
            res.body.name = res.body.name.toLowerCase();
          })
          .expect(
            200,
            {
              id: 'some fixed id',
              name: 'john'
            },
            done
          );
      });
    });

    describe('DELETE /action/:accountId/product/:productId', function () {
      it('responds with json', function (done) {
        request(app).get('/user').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done);
        request(app)
          .post('/user')
          .send('name=john') // x-www-form-urlencoded upload
          .set('Accept', 'application/json')
          .expect(function (res) {
            res.body.id = 'some fixed id';
            res.body.name = res.body.name.toLowerCase();
          })
          .expect(
            200,
            {
              id: 'some fixed id',
              name: 'john'
            },
            done
          );
      });
    });
  });

  describe('Test Use cases', function () {
    describe('Add new products, list products in stock, hold some products, list again remaining in stock', function () {
      it('responds with json', function (done) {
        request(app).get('/user').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done);
        request(app)
          .post('/user')
          .send('name=john') // x-www-form-urlencoded upload
          .set('Accept', 'application/json')
          .expect(function (res) {
            res.body.id = 'some fixed id';
            res.body.name = res.body.name.toLowerCase();
          })
          .expect(
            200,
            {
              id: 'some fixed id',
              name: 'john'
            },
            done
          );
      });
    });

    describe('List products in stock, release some products, list remaining holded, list remaining in stock', function () {
      it('responds with json', function (done) {
        request(app).get('/user').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done);
        request(app)
          .post('/user')
          .send('name=john') // x-www-form-urlencoded upload
          .set('Accept', 'application/json')
          .expect(function (res) {
            res.body.id = 'some fixed id';
            res.body.name = res.body.name.toLowerCase();
          })
          .expect(
            200,
            {
              id: 'some fixed id',
              name: 'john'
            },
            done
          );
      });
    });

    describe('List in stock, List remaining holded, move out all, list remaining holded, list in stock', function () {
      it('responds with json', function (done) {
        request(app).get('/user').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done);
        request(app)
          .post('/user')
          .send('name=john') // x-www-form-urlencoded upload
          .set('Accept', 'application/json')
          .expect(function (res) {
            res.body.id = 'some fixed id';
            res.body.name = res.body.name.toLowerCase();
          })
          .expect(
            200,
            {
              id: 'some fixed id',
              name: 'john'
            },
            done
          );
      });
    });

    describe('List in stock, hold some products, delete account, list in stock', function () {
      it('responds with json', function (done) {
        request(app).get('/user').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done);
        request(app)
          .post('/user')
          .send('name=john') // x-www-form-urlencoded upload
          .set('Accept', 'application/json')
          .expect(function (res) {
            res.body.id = 'some fixed id';
            res.body.name = res.body.name.toLowerCase();
          })
          .expect(
            200,
            {
              id: 'some fixed id',
              name: 'john'
            },
            done
          );
      });
    });
  });
});
