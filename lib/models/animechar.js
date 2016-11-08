const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        require: true
    },
    age: {
        type: Number
    },
    power: {
        type: String,
        require: true
    },
    attackpower: {
        type: Number
    },
    hair_color: {
        type: String,
    },
    showId: {
        type: Schema.Types.ObjectId,
        ref: 'AnimeShows'
    }
});

module.exports = mongoose.model('AnimeChars', schema);