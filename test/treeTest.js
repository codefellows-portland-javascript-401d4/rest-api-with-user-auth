const Tree = require('../lib/model/tree');
const assert = require('chai').assert;

describe('Tree model', () => {

	it('validates with name, type, genus, and percentage', done => {
		const fir = new Tree({
			name: 'subalpine fir',
			type: 'gymnosperm',
			genus: 'Abies',
			percentage: 20
		});

		fir.validate(err => {
			if (!err) done();
			else done(err);
		});
	});

	it('name is required', done => {
		const elm = new Tree();
		elm.type = 'angiosperm';

		elm.validate(err => {
			assert.isOk(err, 'name , genus, and percentage should have been required');
			done();
		});
	});

	it('must be between 0 and 100 percent of trees', done => {
		const fir = new Tree({
			name: 'subalpine fir',
			type: 'gymnosperm',
			genus: 'Abies',
			percentage: 200
		});
			
		fir.validate(err => {
			assert.isOk(err, 'expected error because 200% is too big');
			done();
		});
	});

});