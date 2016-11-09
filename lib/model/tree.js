const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const schema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	type: {
		type: String,
		required: true,
		lowercase: true
	},
	genus: {
		type: String,
		required: true
	},
	percentage: {
		type: Number, 
		min: 0, 
		max: 100,
		required: true
	}
});

module.exports = mongoose.model('Tree', schema);