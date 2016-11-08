/** Created by Gloria Anholt on 11/7/16. **/

const express = require('express');
const app = express();
const morgan = require('morgan');
const authors = require('./routes/authorRouter');
const errorHandler = require('./error-handler');


app.use(morgan('dev'));

app.use('/api/authors', authors);

app.use(errorHandler);


module.exports = app;
