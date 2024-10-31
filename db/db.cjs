const mongoose = require("mongoose");
require("dotenv").config()

const dbConnection = mongoose.connect(
  process.env.DATABASE_URL
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
  console.log("Connected to Database");
});

module.exports = mongoose;
