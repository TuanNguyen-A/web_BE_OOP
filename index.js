const express = require('express');
const bodyParser = require("body-parser");
const mongoClient = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

var cors = require('cors');
app.use(cors({
  origin: '*',
  exposedHeaders: 'Authorization',
}))

// Middlewares
app.use(bodyParser.json());

// setup connect mongodb by mongoose
mongoClient
  .connect("mongodb://localhost/OOP_web", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected database from mongodb."))
  .catch((error) =>
    console.error(`❌ Connect database is failed with error which is ${error}`)
  );

// Routes
const route = require('./routes');
route(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


