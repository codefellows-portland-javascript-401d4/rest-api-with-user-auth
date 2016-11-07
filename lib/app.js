const express = require('express');
const app = express();

const morgan = require('morgan');
const errorHandler = require('./error-handler');

const clubs = require('./routes/clubs');
const members = requre('/routes/members');

//TODO: add in authentication files here

app.use(morgan('dev'));

app.use('/clubs', clubs);
app.use('/members', members);

app.use(errorHandler);

module.exports = app;