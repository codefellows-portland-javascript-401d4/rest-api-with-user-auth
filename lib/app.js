const express = require('express');
const trees = require('./routes/trees');
const animals = require('./routes/animals');
const signup = require('./routes/signUp');
const login = require('./routes/logIn');
const morgan = require('morgan');
const app = express();



app.use(morgan('dev'));

// routes go here
app.use('/api/trees', trees);
app.use('/api/animals', animals);
app.use('/api/signup', signup);
app.use('api/login', login);
module.exports = app;