const bodyParser = require('body-parser');
const person = require('./models/person');
const team = require('./models/team');
const morgan = require('morgan');
const app = require('express');
const authorized = require('./auth/authorized')

app.use(morgan('dev'));

app.use('/api/team', team);
app.use('/api/person', person);



module.exports = app