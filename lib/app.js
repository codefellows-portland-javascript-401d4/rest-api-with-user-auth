
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

app.use('/api/auth', auths); // sign-up and sign-in are here

// the USERS and ROLES routes are only available to admin and super-user roles.
app.use('/api/users', ensureAuth, ensureRole('admin','super-user'), users);
app.use('/api/roles', ensureAuth, ensureRole('admin','super-user'), roles);

app.use('/api/aptBldgs', ensureAuth, aptBuildings);
app.use('/api/apartmentUnits', ensureAuth, apartmentUnits);

app.use(errorHandler);

module.exports = app;
