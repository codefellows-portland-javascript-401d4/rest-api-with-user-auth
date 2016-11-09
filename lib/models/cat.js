const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  chill: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Cat', schema);
