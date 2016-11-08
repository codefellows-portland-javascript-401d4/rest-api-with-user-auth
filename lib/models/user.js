const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Please enter a name']
  },
  password: {
    type: String,
    required: [true, 'Please enter your password']
  },
  roles: [String]
});

userSchema.methods.generateHash = function(password) {
  return this.password = bcrypt.hashSync(password);
};

userSchema.methods.compareHash = function(password) {
  return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', userSchema);