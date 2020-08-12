'use strict';
process.env.API_TYPE = 'graphql';
process.env.DATABASE_NAME = 'db_graphql';

const request = require('supertest');
const config = require('../../src/config');

const testDB = require('../test-utils/db');
const db = require('../../src/database');
db.client = testDB.client || db.client;

const { createToken } = require('../../src/libs/token-auth');
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

describe('Integration tests - Graphql Api', function () {
  const testAuthToken = createToken({ username: config.server.adminLogin, password: config.server.adminPassword });
  beforeAll(async () => {
    await testDB.connect();
  });
  afterAll(async () => {
    await testDB.teardown();
    await testDB.disconnect(db.client);
    await app.close();
  });

  describe('Test requests', function () {
    let accountId, productId, stockAmount, holdAmount, productIdB, stockAmountB, holdAmountB;
    const productA = 'product-A';
    const productB = 'product-B';
    const username = 'testuser-graphql';

    describe('addAccount', function () {
      it('responds 200 with account ID', async () => {
        await doCall(request(app).post('/graphql'))
          .set('Authorization', `Bearer ${testAuthToken}`)
          .send({ query: `mutation { addAccount(username: "${username}"){id}}` })
          .expect(200)
          .expect(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('addAccount');
            expect(res.body.data.addAccount).toHaveProperty('id');
            expect(typeof res.body.data.addAccount.id).toEqual('string');
            accountId = res.body.data.addAccount.id;
          });
      });

      it('responds 400 bad request', async () => {
        await doCall(request(app).post('/graphql'))
          .set('Authorization', `Bearer ${testAuthToken}`)
          .send({ query: `mutation { addAccount(){id}}` })
          .expect(400);
      });

      it('responds 403 forbidden', async () => {
        const username = 'testuser-graphql2';
        await doCall(request(app).post('/graphql'))
          .send({ query: `mutation { addAccount(username: "${username}"){id}}` })
          .expect(200)
          .expect(res => {
            expect(res.body).toHaveProperty('errors');
            expect(Array.isArray(res.body.errors)).toBe(true);
            expect(res.body.errors[0]).toHaveProperty('message');
            expect(res.body.errors[0].message).toEqual('must be authenticated as admin');
          });
      });
    });

    describe('removeAccount', function () {
      it('responds 200 OK', async () => {
        const username2 = 'testuser-graphql2';
        let tempId;
        await doCall(request(app).post('/graphql'))
          .set('Authorization', `Bearer ${testAuthToken}`)
          .send({ query: `mutation { addAccount(username: "${username2}"){id}}` })
          .expect(200)
          .expect(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('addAccount');
            expect(res.body.data.addAccount).toHaveProperty('id');
            expect(typeof res.body.data.addAccount.id).toEqual('string');
            tempId = res.body.data.addAccount.id;
          });

        await doCall(request(app).post('/graphql'))
          .set('Authorization', `Bearer ${testAuthToken}`)
          .send({ query: `mutation { removeAccount(accountId: "${tempId}")}` })
          .expect(200);
      });
    });

    describe('addProduct', function () {
      it('responds 200 OK with product ID', async () => {
        const amount = 100;
        await doCall(request(app).post('/graphql'))
          .set('Authorization', `Bearer ${testAuthToken}`)
          .send({
            operationName: 'addProductToDepot',
            variables: { productA, amount },
            query: `mutation addProductToDepot($productA: String!, $amount: Int!) { 
              addProduct(name: $productA, amount: $amount) { 
                id 
              }
            }`
          })
          .expect(200)
          .expect(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('addProduct');
            expect(res.body.data.addProduct).toHaveProperty('id');
            expect(typeof res.body.data.addProduct.id).toEqual('string');
            productId = res.body.data.addProduct.id;
            stockAmount = amount;
          });

        await doCall(request(app).post('/graphql'))
          .set('Authorization', `Bearer ${testAuthToken}`)
          .send({
            operationName: 'addProductToDepot',
            variables: { productB, amount },
            query: 'mutation addProductToDepot($productB: String!, $amount: Int!) {  addProduct(name: $productB, amount: $amount) { id }}'
          })
          .expect(200)
          .expect(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('addProduct');
            expect(res.body.data.addProduct).toHaveProperty('id');
            expect(typeof res.body.data.addProduct.id).toEqual('string');
            productIdB = res.body.data.addProduct.id;
            stockAmountB = amount;
          });
      });
    });

    describe('increase amount of product in depot', function () {
      it('responds 200 OK and product in stock updated', async () => {
        const amount = 70;
        const expectedAmount = stockAmount + amount;
        await doCall(request(app).post('/graphql'))
          .set('Authorization', `Bearer ${testAuthToken}`)
          .send({
            operationName: 'increaseProduct',
            variables: {
              productId,
              amount
            },
            query: `mutation increaseProduct($productId: ID!, $amount: Int!) { 
                updateProductStock(productId: $productId, amount: $amount) { 
                  id 
                  amount 
                  name 
                }
              }`
          })
          .expect(200)
          .expect(res => {
            expect(res.body).toStrictEqual({
              data: {
                updateProductStock: { id: productId, amount: expectedAmount, name: productA }
              }
            });
            stockAmount = expectedAmount;
          });
      });
    });

    describe('list products in depot', function () {
      it('responds 200 OK with list of products', async () => {
        await doCall(request(app).post('/graphql'))
          .send({ operationName: null, variables: {}, query: '{ products { id name amount }}' })
          .expect(200)
          .expect(res => {
            expect(Array.isArray(res.body.data.products)).toBe(true);
            expect(res.body.data.products.length).toEqual(2);
            expect(res.body.data.products[0]).toHaveProperty('name');
            expect(res.body.data.products[0]).toHaveProperty('amount');
            expect(res.body.data.products[1]).toHaveProperty('name');
            expect(res.body.data.products[1]).toHaveProperty('amount');
            const product = res.body.data.products.find(prod => prod.id === productId);
            expect(product).toMatchObject({ id: productId, name: productA, amount: stockAmount });
          });
      });
    });

    describe('holdProduct', function () {
      it('responds 200 OK with a hold product', async () => {
        const amount = 80;
        const expectedAmount = stockAmount - amount;
        const expectedAmountB = stockAmountB - amount;
        await doCall(request(app).post(`/graphql`))
          .send({
            operationName: 'HoldProductAction',
            variables: { accountId, productId, amount },
            query: `mutation HoldProductAction($accountId: ID! $productId: ID! $amount: Int!){
              holdProduct(accountId: $accountId, productId: $productId, amount: $amount) { 
                holder { 
                  id 
                  username 
                } 
                amount 
                product{  
                  id 
                  name 
                  amount 
                }
              }
            }`
          })
          .expect(200)
          .expect(res => {
            expect(res.body).toStrictEqual({
              data: {
                holdProduct: {
                  holder: { id: accountId, username },
                  amount: amount,
                  product: { id: productId, name: productA, amount: expectedAmount }
                }
              }
            });
            stockAmount = expectedAmount;
            holdAmount = amount;
          });

        await doCall(request(app).post(`/graphql`))
          .send({
            operationName: 'HoldProductAction',
            variables: { accountId, productIdB, amount },
            query: `mutation HoldProductAction($accountId: ID! $productIdB: ID! $amount: Int!){
              holdProduct(accountId: $accountId, productId: $productIdB, amount: $amount) { 
                holder { 
                  id 
                  username 
                } 
                amount 
                product{  
                  id 
                  name 
                  amount 
                }
              }
            }`
          })
          .expect(200)
          .expect(res => {
            stockAmountB = expectedAmountB;
            holdAmountB = amount;
          });
      });
    });

    describe('getAccountHolds', function () {
      it('responds 200 OK', async () => {
        await doCall(request(app).post(`/graphql`))
          .send({
            operationName: 'getAccountHoldProducts',
            variables: { accountId },
            query: `query getAccountHoldProducts($accountId: ID!) {  
              getAccountHolds(accountId: $accountId) { 
                holder {
                  id
                  username
                }
                product {
                  id
                  name
                  amount
                }
                amount
              }
            }`
          })
          .expect(200)
          .expect(res => {
            expect(res.body).toStrictEqual({
              data: {
                getAccountHolds: [
                  {
                    holder: { id: accountId, username },
                    product: { id: productId, name: productA, amount: stockAmount },
                    amount: holdAmount
                  },
                  {
                    holder: { id: accountId, username },
                    product: { id: productIdB, name: productB, amount: stockAmountB },
                    amount: holdAmountB
                  }
                ]
              }
            });
          });
      });
    });

    describe('updateCartAmount', function () {
      it('responds 200 and hold product amount updated', async () => {
        const amount = -35;
        const expectedStockAmount = stockAmount - amount;
        const expectedHoldAmount = holdAmount + amount;
        await doCall(request(app).post(`/graphql`))
          .send({
            operationName: 'updateHoldProductAmount',
            variables: { accountId, productId, amount },
            query: `mutation updateHoldProductAmount($accountId: ID! $productId: ID! $amount: Int!){
              updateCartAmount(accountId: $accountId, productId: $productId, amount: $amount) { 
                holder { 
                  id 
                  username 
                } 
                amount 
                product{  
                  id 
                  name 
                  amount 
                }
              }
            }`
          })
          .expect(200)
          .expect(res => {
            expect(res.body).toStrictEqual({
              data: {
                updateCartAmount: {
                  holder: { id: accountId, username },
                  amount: expectedHoldAmount,
                  product: { id: productId, name: productA, amount: expectedStockAmount }
                }
              }
            });
            stockAmount = expectedStockAmount;
            holdAmount = expectedHoldAmount;
          });
      });
    });

    describe('moveCart', function () {
      it('responds 200 OK with hold product = 0', async () => {
        await doCall(request(app).post(`/graphql`))
          .send({
            operationName: 'accountMoveProduct',
            variables: { accountId, productId },
            query: `mutation accountMoveProduct($accountId: ID! $productId: ID!) {
              moveCart(accountId: $accountId, productId: $productId) {
                holder {
                  id
                  username
                }
                product {
                  id
                  name
                  amount
                }
                amount
              }
            }`
          })
          .expect(200)
          .expect(res => {
            expect(res.body).toStrictEqual({
              data: {
                moveCart: {
                  holder: { id: accountId, username },
                  product: { id: productId, name: productA, amount: stockAmount },
                  amount: 0
                }
              }
            });
          });
      });
    });

    describe('removeAccount and check depot stock', function () {
      it('responds 200 OK, account removed', async () => {
        await doCall(request(app).post('/graphql'))
          .set('Authorization', `Bearer ${testAuthToken}`)
          .send({ query: `mutation { removeAccount(accountId: "${accountId}")}` })
          .expect(200);
      });

      it('responds OK, account held and unmoved products are returned to depot stock', async () => {
        await doCall(request(app).post('/graphql'))
          .send({ operationName: null, variables: {}, query: '{ products { id name amount }}' })
          .expect(200)
          .expect(res => {
            expect(res.body).toStrictEqual({
              data: {
                products: [
                  { id: productId, name: productA, amount: stockAmount },
                  { id: productIdB, name: productB, amount: stockAmountB + holdAmountB }
                ]
              }
            });
          });
      });
    });
  });
});
