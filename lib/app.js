const express = require('express');
const app = express();
const errorHandler = require('./error-handler');
const morgan = require('morgan');
const artists = require('./routes/artists');
const auth = require('./routes/auth');
const ensureAuth = require('./auth/ensure-auth')();

app.use(morgan('dev'));

app.use('/api/auth', auth);

app.use('/api/artists', ensureAuth, artists);

app.use(errorHandler);

module.exports = app;
