'use strict'

const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString } = graphql

const restaurantType = new GraphQLObjectType({
	name: 'Restaurant',
	fields: {
		id: { type: graphql.GraphQLString },
		name: {
			type: GraphQLString
		},
		speciality: {
			type: GraphQLString
		}
	}
})


// join-monster additional fields
restaurantType._typeConfig = {
	sqlTable: 'restaurants',
	uniqueKey: 'id',
}

module.exports = restaurantType
