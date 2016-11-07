/** Created by Gloria Anholt on 11/7/16. **/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


const userSchema = new Schema({

  username: { type: String, required: true },
  hashpass: { type: String, required: true },
  roles: [String],
  favoriteBooks: [{ type: String, ref: 'Book' }],
  favoriteAuthors: [{ type: String, ref: 'Author' }]

});

userSchema.methods.generateHash = function( password ) {
  return this.hashpass = bcrypt.hashSync( password, 8 );
};

userSchema.methods.validateHash = function( password ) {
  return bcrypt.compareSync( password, this.hashpass );
};


module.exports = mongoose.model('User', userSchema);