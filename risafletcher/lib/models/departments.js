const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    max: [25],
    required: true
  },
  director: {
    type: String,
    default: 'none',
    required: true
  }
});

module.exports = mongoose.model('Departments', schema);