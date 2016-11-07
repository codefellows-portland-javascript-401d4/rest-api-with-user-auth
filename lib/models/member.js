const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema ({
    name: String,
    clubId: {
        type: Schema.Types.ObjectId,
        ref: 'club'
    }
});

module.exports = mongoose.model('Member', schema);