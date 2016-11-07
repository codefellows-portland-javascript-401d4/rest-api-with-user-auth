/** Created by Gloria Anholt on 11/7/16. **/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const bookSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author'
  },
  pubDate: {
    type: Number,
    required: true
  },
  publisher: String,
  pubCity: String

});

module.exports = mongoose.model('Book', bookSchema);