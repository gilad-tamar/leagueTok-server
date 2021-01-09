const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');

const port = process.env.PORT || 8080;

const app = express();

mongoose.connect(`mongodb+srv://${process.env.MongoDB_User}:${process.env.MongoDB_Password}@sportstar.deqis.mongodb.net/<dbname>?retryWrites=true&w=majority`,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
.then(() => {
  console.log('Connected to database');
  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
});