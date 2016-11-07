const express = require('express');
const app = express();
const morgan = require('morgan');
const log = morgan('dev');
const userAuth = require('./routes/auth');
const ensureAuth = require('./auth/ensureAuth')();
const ensureRole = require('./auth/ensureRole');
const animeShows = require('./routes/animeshows');
const animeChars = require('./routes/animechars');

app.use(log);

app.use('/users', userAuth);
app.use('/animeshows', ensureAuth, ensureRole(['admin', 'superuser']), animeShows);
app.use('/animechars', ensureAuth, animeChars);

app.use(errorHandler);

module.exports = app;