// Testing the Apartment Unit Model
const Role = require('../lib/models/role');
const assert = require('chai').assert;

describe('Validate Role model', () => {
    it('Validation with all properties', done => {
        const newRole = new Role({
            name: 'test role',
            code: 100,
            accessLevel: 'ALL'
        });

        newRole.validate(err => {
            if (!err) done();
            else done(err);
        });
    });

    it('Validation with no name', done => {
        const newRole = new Role({
            code: 100,
            accessLevel: 'ALL'
        });

        newRole.validate(err => {
            assert.isOk(err, 'role name is required');
            done();
        });
    });

    it('Validation with no code', done => {
        const newRole = new Role({
            name: 'test role',
            accessLevel: 'ALL'
        });

        newRole.validate(err => {
            assert.isOk(err, 'role code is required');
            done();
        });
    });

    it('Validation with non-numeric code', done => {
        const newRole = new Role({
            name: 'testrole',
            code: 'code',
            accessLevel: 'ALL'
        });

        newRole.validate(err => {
            assert.isOk(err, 'role code should be numeric');
            done();
        });
    });

    it('Validation with negative code', done => {
        const newRole = new Role({
            name: 'testrole',
            code: -100,
            accessLevel: 'ALL'
        });

        newRole.validate(err => {
            assert.isOk(err, 'role code should be not be negative');
            done();
        });
    });


});
