
const express = require('express');
const morgan = require('morgan');

const errorHandler = require('./error-handler');

const aptBuildings = require('./routes/aptBuildings');
const apartmentUnits = require('./routes/apartmentUnits');
const users = require('./routes/users');
const roles = require('./routes/roles');
const auths = require('./routes/auths');


const app = express();

const ensureAuth = require('./auth/ensure-auth')();
const ensureRole = require('./auth/ensure-role');

app.use(morgan('dev')); // use for logging

app.use('/api/auth', auths);

app.use('/api/users', users);
// app.use('/api/users', ensureAuth, users);

app.use('/api/roles', ensureAuth, roles);

app.use('/api/aptBldgs', aptBuildings);
// app.use('/api/aptBldgs', ensureAuth, ensureRole('admin','super-user'), aptBuildings);

app.use('/api/apartmentUnits', apartmentUnits);
// app.use('/api/apartmentUnits', ensureAuth, ensureRole('admin','super-user'), apartmentUnits);

app.use(errorHandler);

module.exports = app;
