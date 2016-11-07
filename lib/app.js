const express = require('express');
const trees = require('./routes/trees');
const animals = require('./routes/animals');
const app = express();

// routes go here
app.use('/api/trees', trees);
app.use('/api/animals', animals);

module.exports = app;