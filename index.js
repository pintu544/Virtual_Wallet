const express = require("express");
const port = process.env.PORT || 8080;
const dotenv = require("dotenv").config();
const db = require("./config/mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server : ${err}`);
    return;
  }
  console.log(`Server is up and running on port : ${port}`);
});
