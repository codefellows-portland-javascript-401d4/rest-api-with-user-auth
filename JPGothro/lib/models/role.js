
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        min: 0,
        required: true
    },
    accessLevel: {
        type: String
    }
});

module.exports = mongoose.model('Role', schema);
