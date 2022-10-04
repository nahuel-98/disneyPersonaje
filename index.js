const app = require("./app");
require("./db");
const express = require("express");
var morgan = require("morgan");
const { db } = require("./db.js");

//MIDDLEWARES
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false })); //permite entender lo que llegue de formularios convirtiendolo en un objeto JS.

var server = app.listen(4001, () => {
  console.log("Listening on port 4001 :)");
  db.sync({ force: false });
});

module.exports = server;
