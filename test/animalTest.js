const Animal = require('../lib/model/animal');
const assert = require('chai').assert;

describe('Animal model', () => {

	it('validates with name, nutrition, and genus', done => {
		const elk = new Animal({
			name: 'elk',
			nutrition: 'herbivore',
			genus: 'Cervus'
		});

		elk.validate(err => {
			if (!err) done();
			else done(err);
		});
	});

	it('name is required', done => {
		const bear = new Animal();
		bear.genus = 'Ursus';

		bear.validate(err => {
			assert.isOk(err, 'name and nurtrition should have been required');
			done();
		});
	});

	it('must have a genus', done => {
		const wolf = new Animal({
			name: 'wolf',
			nurition: 'carnivore'
		});
			
		wolf.validate(err => {
			assert.isOk(err, 'genus is required');
			done();
		});
	});

});