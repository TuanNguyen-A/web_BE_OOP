const express = require('express');
const bodyParser = require("body-parser");
const mongoClient = require("mongoose");
const dbConfig = require("./configs/db");

const app = express();
const port = process.env.PORT || 3000;

var cors = require('cors');
app.use(cors({
  origin: '*',
  exposedHeaders: 'Authorization',
}))

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended: true}))

// Middlewares
app.use(bodyParser.json());

// setup connect mongodb by mongoose
mongoClient
  .connect(dbConfig.url + dbConfig.database, {
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


