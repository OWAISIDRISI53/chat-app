require("dotenv").config();

function connectDb() {
  const mongoose = require("mongoose");
  const url = process.env.mongo;
  //  ||
  mongoose.connect(url, { useNewUrlParser: true });
  const connection = mongoose.connection;

  connection.on("error", console.error.bind(console, "connection error"));

  connection.once("open", () => console.log("Connected to database"));
}

module.exports = connectDb;
