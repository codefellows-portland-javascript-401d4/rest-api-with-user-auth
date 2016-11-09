const bodyParser = require('body-parser');
const express = require('express');
const person = require('./models/person');
const team = require('./models/team');
const morgan = require('morgan');
const app = express();
const authorized = require('./auth/authorized')

app.use(morgan('dev'));

app.use('/team', team);
app.use('/api/person', person);



module.exports = app