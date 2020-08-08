const { readFileSync } = require('fs');
const path = require('path');
const { makeExecutableSchema } = require('graphql-tools');

const queries = require('../services/queries');

const schema = makeExecutableSchema({
  typeDefs: readFileSync(path.join(__dirname, '/../graphql/schemas.graphql'), 'utf8'),
  resolvers: {
    // Prototypes des fonctions GET
    Query: {
      users: (_, filters) => queries.getUsers(filters),
      products: (_, filters) => queries.getProducts(filters),
      holding: (_, filters) => queries.getHolding(filters)
    },
    // Prototypes des fonctions POST, UPDATE, DELETE
    Mutation: {
      addUser: async (_, user) => {
        let newUser;

        await queries.addUser(user).then((data) => (newUser = data));

        return newUser[0];
      },
      deleteUser: async (_, userId) => {
        let deletedUser;

        await queries.deleteUser(userId).then((data) => (deletedUser = data));

        return deletedUser[0];
      },

      addProduct: async (_, product) => {
        let newProduct;

        await queries.addProduct(product).then((data) => (newProduct = data));

        return newProduct[0];
      },
      holdProducts: async (_, productToHold) => {
        let hold;

        await queries.holdProducts(productToHold).then((data) => (hold = data));

        return hold[0];
      },
      releaseProduct: async (_, productToRelease) => {
        let release;

        await queries.releaseProduct(productToRelease).then((data) => (release = data));

        return release[0];
      },
      moveHolding: async (_, productToMove) => {
        let move;

        await queries.moveHolding(productToMove).then((data) => (move = data));

        return move[0];
      }
    }
  }
});

module.exports = schema;
