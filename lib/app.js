const bodyParser = require('body-parser');
const express = require('express');
const person = require('./routes/persons');
const team = require('./routes/teams');
const userJoin = require('./routes/authorize');
const morgan = require('morgan');
const app = express();
const userCheck = require('./auth/userCheck');
const authorized = require('./auth/authCheck');

app.use(morgan('dev'));

app.use('/team', team);
app.use('/person', person);
app.use('/join', userJoin);


module.exports = app;