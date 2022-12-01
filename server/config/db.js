const { cyan } = require('colors');
const mongoose = require('mongoose');

const connectDB = async () => { // connectDB should be async cause it returns promise
  const conn = await mongoose.connect(process.env.MONGO_URI) // connect to the database 

  // .cyan.underline.bold comming from colors package to colorize and set underline for the line
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = connectDB