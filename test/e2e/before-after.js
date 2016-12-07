'use strict';

const connection = require('../../lib/mongoose');
const db = require('./db');

before(db.drop());
after(() => connection.close());
