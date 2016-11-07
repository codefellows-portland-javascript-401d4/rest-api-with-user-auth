/** Created by Gloria Anholt on 11/7/16. **/

const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const errorHandler = require('./error-handler');



app.use(errorHandler);

module.exports = app;
