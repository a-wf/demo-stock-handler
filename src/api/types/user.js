'use strict'

const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString, GraphQLInt } = graphql

const userType = new GraphQLObjectType({
	name: 'User',
	fields: {
		id: { type: graphql.GraphQLString },
		name: {
			type: GraphQLString
		},
		gender: {
			type: GraphQLString
		}
	}
})

// join-monster additional fields
userType._typeConfig = {
	sqlTable: 'users',
	uniqueKey: 'id',
}

module.exports = userType
