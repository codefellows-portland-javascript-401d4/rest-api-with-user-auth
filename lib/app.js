const express = require('expres');
const app = express();
const errorHandler = require('./errorhandler');
const staff = require('./routes/staff');
const depts = require('./routes/departments');

app.use('/api/staff', staff);
app.use('/api/departments', depts);
app.use(errorHandler);

module.exports = app;