const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    teamName: {
        type: String,
        required: true
    },
    city: {
        type: String
    },
    players: []
});

module.exports = mongoose.model('Team', schema);
