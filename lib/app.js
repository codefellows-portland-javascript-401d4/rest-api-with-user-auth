const bodyParser = require('body-parser');
const express = require('express');
const person = require('./routes/persons');
const team = require('./routes/teams');
const morgan = require('morgan');
const app = express();
const authorized = require('./auth/authorized')

app.use(morgan('dev'));

app.use('/team', team);
app.use('/person', person);



module.exports = app