const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/index');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const port = 8000;

const app = express();
// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
  origin: '*', // Allow all origins (adjust for production)
  methods: 'PUT,GET, POST, DELETE, PATCH, OPTIONS', // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers, including Content-Type
}));
app.use(express.json());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Method', 'POST, GET, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization');
  next();
})
route(app);

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})