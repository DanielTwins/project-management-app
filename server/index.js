const express = require("express"); // create the server
const colors = require('colors') // a package to colorize the logged text lines
const cors = require('cors')
const { graphqlHTTP } = require("express-graphql"); // define graphql http from express-graphql package
const schema = require('./schema/schema')
require("dotenv").config(); // to get .env work, call the config method
const connectDB = require('./config/db')
const port = process.env.PORT || 5000; // it will first look in the environment variable in .env file, if not then goes to port 5000

const app = express(); // initialize the express/server

// connect to database
connectDB()

// add the middleware for the cors
app.use(cors())

// after we created the schema in schema.js we can then make a request to the '/graphql' endpoint
// and we can do that with graphiql tool
app.use('/graphql', graphqlHTTP({
  schema, // if we name the schema something different above then should do as: schema: schemaName,
  graphiql: process.env.NODE_ENV === 'development' // usually set it to true, but we want set it to true if we are in
  // development environment, and if it equals to 'development' then it evaluates to true, but not e.g. 'production' 
}))

app.listen(port, console.log(`Server is running on port ${port}`));

