const express = require('express');
const app = express();
const cats = require('./routes/cats');
const auth = require('./routes/auth');
const errorHandler = require('./error-handler');

const checkAuth = require('./auth/check-auth')();

app.get('/', (req, res) => {
  res.send('Welcome to catDB!');
});

app.use('/auth', auth);
app.use('/cats', checkAuth, cats);

app.use(errorHandler);

module.exports = app;
