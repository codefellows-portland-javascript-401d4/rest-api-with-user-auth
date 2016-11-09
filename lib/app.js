const express = require('express');
const app = express();

const morgan = require('morgan');
const errorHandler = require('./error-handler');

const auth = require('./routes/auth');
const clubs = require('./routes/clubs');
const members = require('./routes/members');

//TODO: add in authentication files here

const ensureAuth = require('./auth/ensure-auth')();
const ensureRole = require('./auth/ensure-role');

app.use(morgan('dev'));

app.use('/auth', auth);
app.use('/clubs', clubs);
app.use('/members', ensureAuth, members);

app.use(errorHandler);

module.exports = app;