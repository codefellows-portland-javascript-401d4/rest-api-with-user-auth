/** Created by Gloria Anholt on 11/7/16. **/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


const userSchema = new Schema({

  username: { type: String, required: true },
  password: { type: String, required: true },
  roles: [String],
  favoriteBooks: [{ type: String, ref: 'Book' }],
  favoriteAuthors: [{ type: String, ref: 'Author' }]

});

userSchema.methods.generateHash = function( password ) {
  return this.password = bcrypt.hashSync( password, 8 );   // returns the hashed pswd
};

userSchema.methods.validateHash = function( password ) {
  return bcrypt.compareSync( password, this.password );   // returns true or false
};


module.exports = mongoose.model('User', userSchema);