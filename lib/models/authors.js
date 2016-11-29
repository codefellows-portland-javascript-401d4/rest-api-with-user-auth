/** Created by Gloria Anholt on 11/7/16. **/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  YOB: Number,
  YOD: Number,
  books: [{
    type: String,
    ref: 'Book'
  }]
});

authorSchema.methods.getAge = function() {
  if (!this.YOD) {
    return (new Date().getFullYear() - this.YOB);
  } else {
    return (this.YOD - this.YOB);
  }
};

module.exports = mongoose.model('Author', authorSchema);