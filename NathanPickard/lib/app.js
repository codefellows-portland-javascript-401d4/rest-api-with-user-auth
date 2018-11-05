const express = require('express');
const app = express();
const errorHandler = require('./error-handler')
const morgan = require('morgan');

const auth = require('./routes/auth');
const teams = require('./routes/teams');
const coaches = require('./routes/coaches');

const ensureAuth = require('./auth/ensure-auth')();
const ensureRole = require('./auth/ensure-role');

app.use(morgan('dev'));

app.use('/api/auth', auth);
app.use('/api/coaches', ensureAuth, coaches);
app.use('/api/teams', ensureAuth, ensureRole('admin'), teams);

app.use(errorHandler);

module.exports = app;