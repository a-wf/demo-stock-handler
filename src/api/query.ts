'use stric';

const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } = graphql;
const types = require('./types');
const store = require('./../services/store');

const users = [
  {
    name: 'First post',
    gender: 'Content of the first post'
  },
  {
    name: 'Second post',
    gender: 'Content of the second post'
  }
];

const restaurants = [
  {
    name: 'StartPizza',
    speciality: 'pizza'
  },
  {
    name: 'LongSpagetta',
    speciality: 'pates'
  }
];

export default new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: types.userType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (source, { id }) => {
        return users[id];
      }
    },
    restaurant: {
      type: types.restaurantType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (source, { id }) => {
        return users[id];
      }
    },
    restaurants: {
      type: new GraphQLList(types.restaurantType),
      args: {
        speciality: { type: GraphQLString }
      },
      resolve: (source, { speciality }) => {
        return restaurants.map((restaurant) => restaurant.speciality === speciality);
      }
    }
  }
});
