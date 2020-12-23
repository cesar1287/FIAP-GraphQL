const express = require("express")
const {ApolloServer, gql} = require("apollo-server-express")
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const {importSchema} = require('graphql-import')
const resolvers = require('./resolvers')

const serviceAccount = require('./basecesaratividade-graphql-firebase-adminsdk-h7j8x-0daad390e0.json')

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
    databaseURL:"https://basecesaratividade-graphql-default-rtdb.firebaseio.com/"
})

const app = express()

const server = new ApolloServer({
    typeDefs:importSchema('./schema/index.graphql'),
    resolvers: resolvers
})

server.applyMiddleware({app,path:"/",cors:true})

exports.graphql = functions.https.onRequest(app)
