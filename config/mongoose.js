const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
mongoose.set("strictQuery", true);

let mongoDB =
  process.env.MONGODB_URI ||
  "mongodb+srv://pintukumar:jvpp34btuf@cluster0.ss3rpdx.mongodb.net/test";

mongoose.connect(mongoDB, {
  useNewUrlParser: "true",
  useUnifiedTopology: "true",
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "error connecting to db"));

db.once("open", () => {
  console.log("Successfully connected to the database");
});
