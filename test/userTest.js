const User = require('../lib/model/user');
const assert = require('chai').assert;

describe('User model', () => {

	it('validates with name, password, and role', done => {
		const gimli = new User({
			username: 'Gimli',
			password: 'Gloin',
			role: ['Peon']
		});

		gimli.validate(err => {
			if (!err) done();
			else done(err);
		});
	});

	it('name is required', done => {
		const legolas = new User();
		legolas.password = 'Mandos';

		legolas.validate(err => {
			assert.isOk(err, 'name should have been required');
			done();
		});
	});

	it('must have a password', done => {
		const boromir = new User({
			password: 'Gondor',
			role: ['Admin']
		});
			
		boromir.validate(err => {
			assert.isOk(err, 'name is required');
			done();
		});
	});

});