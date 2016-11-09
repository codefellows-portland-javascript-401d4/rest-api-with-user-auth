const mongoose = require('mongoose');
const Schema = mongoose.Schema;

cosnt schema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    jerseyNumber: {
        type: String
    },
    playsFor: {
        type: Schema.Types.ObjectId,
        ref: 'teams'
    }
});

module.exports = mongoose.model('Person', schema);
