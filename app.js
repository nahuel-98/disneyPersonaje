const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Router, para usar controllers y modularizar.
app.use("/", require("./routes/characterRoutes"));
app.use("/", require("./routes/filmRoutes"));
app.use("/", require("./routes/authRoutes"));

module.exports = app;
