const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const schema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	nutrition: {
		type: String,
		required: true
	},
	genus: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Animal', schema);