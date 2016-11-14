const express = require('express');
const app = express();
const errorHandler = require('./errorhandler');
const morgan = require('morgan');
const auth = require('./routes/auth')
const staff = require('./routes/staff');
const depts = require('./routes/departments');
const ensureAuth = require('./auth/ensure-auth')();
const ensureRole = require('./auth/ensure-role');

app.use(morgan('dev'));

app.use('/api/auth', auth);
app.use('/api/staff', ensureAuth, ensureRole('admin'), staff);
app.use('/api/departments', ensureAuth, depts);
app.use(errorHandler);

module.exports = app;