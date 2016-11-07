const express = require('express');
const app = express();
const cats = require('./routes/cats');
const errorHandler = require('./error-handler');

app.get('/', (req, res) => {
  res.send('Welcome to catDB!');
});

app.use('/cats', cats);
app.use(errorHandler);

module.exports = app;
