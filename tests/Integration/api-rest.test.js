'use strict';
process.env.API_TYPE = 'rest';
process.env.DATABASE_NAME = 'db_test_restl';

const request = require('supertest');
const randomstring = require('randomstring');

const inMemoryDB = require('../test-utils/inMemoryMongo');
let db = require('../../src/database');
db.client = inMemoryDB.mongooseClient;

const config = require('../../src/config');
const app = require('../../src/app');

function doCall(request) {
  return request
    .set('accept-encoding', 'compress')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')
    .set('AAccess-Control-Allow-Headers', 'Content-Type')
    .set('content-type', 'application/json')
    .set('accept', 'application/json')
    .set('X-API-KEY', `${config.server.apikey}`);
}

describe('Integration tests - Rest API', function () {
  const authUser = config.server.adminLogin;
  const authPwd = config.server.adminPassword;
  let requestId = 0;
  beforeEach(() => {
    requestId = randomstring.generate();
  });
  beforeAll(async () => {
    await inMemoryDB.connect();
  });
  afterAll(async () => {
    await inMemoryDB.clearDatabase();
    await inMemoryDB.closeDatabase();
    await app.close();
  });

  describe('Test requests', function () {
    let accountId, productId, stockAmount, holdAmount;
    describe('POST /account', function () {
      it('responds with 200 and request ID', async () => {
        const username = 'testuser-rest';
        await doCall(request(app).post('/account'))
          .auth(`${authUser}`, `${authPwd}`)
          .set('X-REQUEST-ID', requestId)
          .send({ username })
          .expect(200)
          .expect('x-request-id', requestId)
          .expect(res => {
            console.log(res.headers);
            expect(res.body.data).toHaveProperty('id');
            expect(typeof res.body.data.id).toEqual('string');
            accountId = res.body.data.id;
          });
      });
      it('responds with 400 bad request', async () => {
        await doCall(request(app).post('/account'))
          .auth(`${authUser}`, `${authPwd}`)
          .set('X-REQUEST-ID', requestId)
          .send({})
          .expect(400)
          .expect('X-REQUEST-ID', requestId)
          .expect(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toEqual("request.body should have required property 'username'");
          });
      });

      it('responds with 401 unauthorized', async () => {
        const username = 'testuser-rest2';
        await doCall(request(app).post('/account'))
          .set('X-REQUEST-ID', requestId)
          .send({ username })
          .expect(401)
          .expect('X-REQUEST-ID', requestId)
          .expect(res => {
            expect(res.body).toHaveProperty('data');

            expect(res.body.data).toEqual('Authorization header required');
          });
      });
    });

    describe('DELETE /account', function () {
      it('responds with 200 and request ID', async () => {
        let temp;
        await doCall(request(app).post('/account'))
          .auth(`${authUser}`, `${authPwd}`)
          .set('X-REQUEST-ID', requestId)
          .send({ username: 'toto' })
          .expect(200)
          .expect('X-REQUEST-ID', requestId)
          .expect(res => {
            expect(res.body.data).toHaveProperty('id');
            expect(typeof res.body.data.id).toEqual('string');
            temp = res.body.data.id;
          });

        await doCall(request(app).delete('/account/' + temp))
          .auth(`${authUser}`, `${authPwd}`)
          .set('X-REQUEST-ID', requestId)

          .expect(200)
          .expect('X-REQUEST-ID', requestId)
          .expect(res => {});
      });
    });

    describe('POST /product', function () {
      it('responds OK with product ID', async () => {
        const productA = 'product-A';
        const productB = 'product-B';
        const amount = 100;
        await doCall(request(app).post('/product'))
          .auth(`${authUser}`, `${authPwd}`)
          .set('X-REQUEST-ID', requestId)

          .send({ name: productA, amount })
          .expect(200)
          .expect('X-REQUEST-ID', requestId)
          .expect(res => {
            expect(res.body.data).toHaveProperty('id');
            expect(typeof res.body.data.id).toEqual('string');
            productId = res.body.data.id;
            stockAmount = amount;
          });

        await doCall(request(app).post('/product'))
          .auth(`${authUser}`, `${authPwd}`)
          .set('X-REQUEST-ID', requestId)

          .send({ name: productB, amount: 70 })
          .expect(200)
          .expect('X-REQUEST-ID', requestId)
          .expect(res => {
            expect(res.body.data).toHaveProperty('id');
            expect(typeof res.body.data.id).toEqual('string');
          });
      });
    });

    describe('PATCH /product/:productId', function () {
      it('responds OK', async () => {
        const amount = 50;
        await doCall(request(app).patch('/product/' + productId))
          .auth(`${authUser}`, `${authPwd}`)
          .set('X-REQUEST-ID', requestId)

          .send({ amount })
          .expect(200)
          .expect('X-REQUEST-ID', requestId)
          .expect(res => {
            stockAmount = stockAmount + amount;
          });
      });
    });

    describe('GET /products', function () {
      it('responds OK with list of products', async () => {
        await doCall(request(app).get('/products'))
          .set('X-REQUEST-ID', requestId)

          .expect(200)
          .expect('X-REQUEST-ID', requestId)
          .expect(res => {
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toEqual(2);
            expect(res.body.data[0]).toHaveProperty('name');
            expect(res.body.data[0]).toHaveProperty('amount');
            expect(res.body.data[1]).toHaveProperty('name');
            expect(res.body.data[1]).toHaveProperty('amount');
            const product = res.body.data.find(prod => prod.id === productId);
            expect(product).toMatchObject({ id: productId, name: 'product-A', amount: stockAmount });
          });
      });
    });

    describe('POST /action/hold?accountId=xxx&productId=xxx', function () {
      it('responds 200', async () => {
        const amount = 80;
        await doCall(request(app).post(`/action/hold?accountId=${accountId}&productId=${productId}`))
          .set('X-REQUEST-ID', requestId)

          .send({ name: productId, amount })
          .expect(200)
          .expect('X-REQUEST-ID', requestId)
          .expect(res => {});

        await doCall(request(app).get('/products'))
          .set('X-REQUEST-ID', requestId)

          .expect(200)
          .expect('X-REQUEST-ID', requestId)
          .expect(res => {
            expect(Array.isArray(res.body.data)).toBe(true);
            const product = res.body.data.find(prod => prod.id === productId);
            expect(product).toMatchObject({ id: productId, name: 'product-A', amount: stockAmount - amount });
          });
        stockAmount = stockAmount - amount;
        holdAmount = amount;
      });
    });

    describe('GET /account/:accountId/products', function () {
      it('responds 200 with list of account', async () => {
        await doCall(request(app).get(`/account/${accountId}/products`))
          .set('X-REQUEST-ID', requestId)

          .expect(200)
          .expect('X-REQUEST-ID', requestId)
          .expect(res => {
            expect(Array.isArray(res.body.data)).toBe(true);
            const product = res.body.data.find(prod => prod.product === productId);
            expect(product).toMatchObject({ product: productId, amount: holdAmount });
          });
      });
    });

    describe('PATCH /action/hold?accountId=xxx&productId=xxx', function () {
      it('responds 200', async () => {
        const amount = -35;
        await doCall(request(app).patch(`/action/hold?accountId=${accountId}&productId=${productId}`))
          .set('X-REQUEST-ID', requestId)

          .send({ amount })
          .expect(200)
          .expect('X-REQUEST-ID', requestId)
          .expect(res => {});

        await doCall(request(app).get(`/account/${accountId}/products`))
          .set('X-REQUEST-ID', requestId)

          .expect(200)
          .expect('X-REQUEST-ID', requestId)
          .expect(res => {
            expect(Array.isArray(res.body.data)).toBe(true);
            const product = res.body.data.find(prod => prod.product === productId);
            expect(product).toMatchObject({ product: productId, amount: holdAmount + amount });
          });

        await doCall(request(app).get('/products'))
          .set('X-REQUEST-ID', requestId)

          .expect(200)
          .expect('X-REQUEST-ID', requestId)
          .expect(res => {
            expect(Array.isArray(res.body.data)).toBe(true);
            const product = res.body.data.find(prod => prod.id === productId);
            expect(product).toMatchObject({ id: productId, name: 'product-A', amount: stockAmount - amount });
          });

        stockAmount = stockAmount - amount;
        holdAmount = holdAmount + amount;
      });
    });

    describe('DELETE /action/hold?accountId=xxx&productId=xxx', function () {
      it('responds with json', async () => {
        await doCall(request(app).delete(`/action/hold?accountId=${accountId}&productId=${productId}`))
          .set('X-REQUEST-ID', requestId)

          .expect(200)
          .expect('X-REQUEST-ID', requestId)
          .expect(res => {});

        await doCall(request(app).get(`/account/${accountId}/products`))
          .set('X-REQUEST-ID', requestId)

          .expect(200)
          .expect('X-REQUEST-ID', requestId)
          .expect(res => {
            expect(Array.isArray(res.body.data)).toBe(true);
          });

        await doCall(request(app).get('/products'))
          .set('X-REQUEST-ID', requestId)

          .expect(200)
          .expect('X-REQUEST-ID', requestId)
          .expect(res => {
            expect(Array.isArray(res.body.data)).toBe(true);
            const product = res.body.data.find(prod => prod.id === productId);
            expect(product).toMatchObject({ id: productId, name: 'product-A', amount: stockAmount });
          });
      });
    });
  });

  describe('Test Use cases', function () {
    // describe('Add new products, list products in stock, hold some products, list again remaining in stock', function () {
    //   it('responds with json', async () => {});
    // });
    // describe('List products in stock, release some products, list remaining holded, list remaining in stock', function () {
    //   it('responds with json', async () => {});
    // });
    // describe('List in stock, List remaining holded, move out all, list remaining holded, list in stock', function () {
    //   it('responds with json', async () => {});
    // });
    // describe('List in stock, hold some products, delete account, list in stock', function () {
    //   it('responds with json', async () => {});
    // });
  });
});
