/** Created by Gloria Anholt on 11/7/16. **/

const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./error-handler');

const authors = require('./routes/authorRouter');
const auth = require('./routes/authRouter');

const ensureAuth = require('./auth/ensure-auth')();

app.use(morgan('dev'));

app.use('/api/auth', auth);
app.use('/api/authors', authors);

app.use(errorHandler);


module.exports = app;
