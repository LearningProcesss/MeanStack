//require("../backend/config/config");
//const db = require('../backend/database/db');
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');
const path = require('path');

const app = express();

mongoose
  .connect(
    "mongodb+srv://"+ process.env.MONGO_ATLAS_USR + ":" + process.env.MONGO_ATLAS_PW +"@cluster0-qmyid.mongodb.net/mean-stack"
  )
  .then(result => {
    console.log("Connessione mongo atlas riuscita.");
  })
  .catch(() => {
    console.log("Connessione mongo atlas non riuscita.");
  });
app.use("/images", express.static(path.join("images")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, resp, next) => {
  resp.setHeader("Access-Control-Allow-Origin", "*");
  resp.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept, Authorization"
  );
  resp.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);


module.exports = app;
