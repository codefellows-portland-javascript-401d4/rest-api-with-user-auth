const express = require('express');
const app = express();
const errorHandler = require('./error-handler');
const morgan = require('morgan');

const auth = require('./routes/auth')
const bookChar = require('./routes/bookchar');
const books = require('./routes/books')

const ensureAuth = require('./auth/ensure-auth')();
const ensureRole = require('./auth/ensure-role');


app.use(morgan('dev'));

app.use('/auth', auth);
app.use('/characters', ensureAuth, bookChar);
app.use('/books', ensureAuth, ensureRole('admin'), books);

app.use(errorHandler);

module.exports = app;