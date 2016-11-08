const express = require('express');
const app = express();
const errorHandler = require('./error-handler');
const morgan = require('morgan');

const auth = require('./routes/auth');
const players = require('./routes/players');
const teams = require('./routes/teams');

const ensureAuth = require('./auth/ensure-auth')();  //middelware, no parameters

app.use(morgan('dev'));

app.use('/api/auth', auth);
app.use('/api/players', ensureAuth, players);
app.use('/api/teams', ensureAuth, teams);

app.use(errorHandler);

module.exports = app;