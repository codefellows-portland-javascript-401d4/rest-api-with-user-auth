const express = require('express');
const app = express();
const morgan = require('morgan');
const log = morgan('dev');
const animeShows = require('./routes/animeshows');
const animeChars = require('./routes/animechars');

app.use(log);

app.use('/animeshows', animeShows);
app.use('/animechars', animeChars);

app.use(errorHandler);

module.exports = app;