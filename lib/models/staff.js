const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const Depts = require('./departments');

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'Intern'
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Departments'
  }
});

module.exports = mongoose.model('Staff', schema);