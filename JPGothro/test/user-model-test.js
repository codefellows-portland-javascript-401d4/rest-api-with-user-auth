// Testing the Apartment Unit Model
const User = require('../lib/models/user');
const assert = require('chai').assert;

describe('Validate User model', () => {
    it('Validation with all properties', done => {
        const newUser = new User({
            username: 'Test User',
            password: 'RandomPWD',
            roles: ['581d1eee6823e51ab3d78fbe']
        });

        newUser.validate(err => {
            if (!err) done();
            else done(err);
        });
    });

    it('Validation with no username', done => {
        const newUser = new User({
            password: 'RandomPWD',
            roles: ['581d1eee6823e51ab3d78fbe']
        });

        newUser.validate(err => {
            assert.isOk(err, 'username is required');
            done();
        });
    });

    it('Validation with no password', done => {
        const newUser = new User({
            username: 'Test User',
            roles: ['581d1eee6823e51ab3d78fbe']
        });

        newUser.validate(err => {
            assert.isOk(err, 'password is required');
            done();
        });
    });


});
