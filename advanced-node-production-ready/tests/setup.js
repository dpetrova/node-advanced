/* Global Jest settings */

/* Test timeout */
jest.setTimeout(30000);

/* MongoDB connection */
const mongoose = require("mongoose");
require("../models/User");
const keys = require("../config/keys");

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

process.on("exit", () => {
  mongoose.connection.close();
});
