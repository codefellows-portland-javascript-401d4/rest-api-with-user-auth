const bodyParser = require('body-parser');
const person = require('./models/person');
const team = require('./models/team');
const morgon = require('morgon');
const app = require('express');


app.use(morgon('dev'));
app.use('/api/team', team);
app.use('/api/person', person);
module.exports = app;
