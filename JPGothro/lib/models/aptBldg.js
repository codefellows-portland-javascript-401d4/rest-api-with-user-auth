const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    nbrunits: {
        type: Number,
        min: 1
    },
    vacantunits: {
        type: Number,
        min: 0
        // ,max: nbrunits
    }
});

module.exports = mongoose.model('AptBldg', schema);
