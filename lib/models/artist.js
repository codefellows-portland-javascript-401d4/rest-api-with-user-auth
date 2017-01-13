const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },

    birthdate: {
        type: String
    },

    movementId: {
        type: Schema.Types.ObjectId,
        ref: 'Movement'
    }
});

module.exports = mongoose.model('Artist', schema);
