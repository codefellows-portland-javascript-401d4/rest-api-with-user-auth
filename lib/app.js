const express = require('express');
const app = express();
const errorHandler = require('./error-handler');
const records = require('./routes/records');
// const users = require('./routes/users');
const auth = require('./routes/auth');
const ensureAuth = require('./auth/ensure-auth')();
const ensureRole = require('./auth/ensure-role');

app.use('/api/auth', auth);
app.use('/api/records', ensureAuth, records);
// app.use('/api/users', users);
app.use(errorHandler);

module.exports = app;