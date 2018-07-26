// Here we hold the Express App

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const profilesRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

mongoose.connect("mongodb+srv://buch:" + process.env.MONGO_ATLAS_PW + "@firmenbuch-zowaj.mongodb.net/test?")
  .then(() => {
    console.log('Connected to database!')
  })
  .catch(() => {
    console.log('Connection failed!');
  });
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use("/images", express.static(path.join("backend/images")));
  
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
  });

// PASSWORD: VLpzWlrIiaT5Z02n

app.use("/api/profile", profilesRoutes);
app.use("/api/user", userRoutes);

module.exports = app;   // It's like a Listener
