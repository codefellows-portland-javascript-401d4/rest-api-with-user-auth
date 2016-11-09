const express = require('express');
const trees = require('./routes/trees');
const animals = require('./routes/animals');
const signup = require('./routes/signUp');
const login = require('./routes/logIn');
const errorHandler = require('./errorHandler');
const checkAuth = require('./auth/checkAuth')(); 
const checkRole = require('./auth/checkRole');
const morgan = require('morgan');
const app = express();



app.use(morgan('dev'));

// routes go here
app.use('/api/trees', checkAuth, trees);
app.use('/api/animals', checkAuth, checkRole('Admin'),  animals);
app.use('/api/signup', signup);
app.use('/api/login', login);

app.use(errorHandler);

module.exports = app;