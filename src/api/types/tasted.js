'use strict'

const graphql = require('graphql')
const { GraphQLObjectType } = graphql
const userType = require('./user')
const restaurantType = require('./restaurant')

const tastedRestaurantType = new GraphQLObjectType({
	name: 'TastedRestaurant',
	fields: {
		id: { type: graphql.GraphQLString },
		user: {
			type: userType,
			sqlJoin: (tastedTable, userTable, args) => `${tastedTable}.userId = ${userTable}.id`
		},
		restaurant: {
			type: restaurantType,
			sqlJoin: (tastedTable, restaurantTable, args) => `${tastedTable}.restaurantId = ${restaurantTable}.id`
		},
	}
})

// join-monster additional fields
tastedRestaurantType._typeConfig = {
	sqlTable: 'tasteds',
	uniqueKey: 'id',
}

module.exports = tastedRestaurantType
