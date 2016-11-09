const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema ({
    name: String, 
    topic: String,
    secret: Boolean
});

module.exports = mongoose.model('Club', schema);