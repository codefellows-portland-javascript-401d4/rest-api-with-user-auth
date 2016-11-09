const express = require('express');
const app = express();
const errorHandler = require('./errorHandler');
const cities = require('./routes/cities');
const countries = require('./routes/countries');
const auth = require('./routes/auth');
const ensureAuth = require('./auth/ensure-auth')();
const ensureRole = require('./auth/ensure-role');

app.use('/auth', auth);
app.use('/cities', ensureAuth, cities);
app.use('/countries', ensureAuth, ensureRole('admin', 'super-user'), countries);
app.use(errorHandler);

module.exports = app;