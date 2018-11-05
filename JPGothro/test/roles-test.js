
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const path = require('path');
// load test env variables
require('dotenv').load({silent: true, path: path.join(__dirname, '.env.test') });

const connection = require('../lib/mongoose-config');
const app = require('../lib/app');

describe('Validating User Roles: ', () => {

    before( done => {
        const CONNECTED = 1;
        if (connection.readyState === CONNECTED) dropCollection();
        else connection.on('open', dropCollection);

        function dropCollection(){
            const name = 'roles';
            connection.db
                .listCollections({ name })
                .next( (err, collinfo) => {
                    if (!collinfo) return done();
                    connection.db.dropCollection(name, done);
                });
        }
    });

    const testRole = {
        name: 'Test Role Admin',
        code: 100,
        accessLevel: 'none'
    };

    const testRoleUpd = {
        name: 'admin',
        accessLevel: 'ALL'
    };

    const testRoleFinal = {
        name: 'admin',
        code: 100,
        accessLevel: 'ALL'
    };

    const testRole2 = {
        name: 'temporary Role',
        code: 400,
        accessLevel: 'ALL'
    };

    const userAdmin = {
        username: 'Test Admin Roles',
        password: 'RolePWD',
        roles: ['admin']
    };

    let tokenAdmin = '';

    const request = chai.request(app);

    before( done => {
        request
            .post( '/api/auth/signup' )
            .send( userAdmin )
            .then( res => assert.ok( tokenAdmin = res.body.token ))
            .then( done )
            .catch(done);
    });

    it('GET all - no token', done => {
        request
            .get('/api/roles')
            .then( res => done( 'status should not be 200' ) )
            .catch( res => {
                assert.equal( res.status, 400 );
                assert.equal( res.response.body.error, 'unauthorized, no token provided' );
                done();
            });
    });

    it('GET all - valid token', done => {
        request
            .get('/api/roles')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .then( res => {
                assert.deepEqual(res.body, []);
                done();
            })
            .catch(done);
    });

    it('POST request - no token', done => {
        request
            .post('/api/roles')
            .send(testRole)
            .then( res => done( 'status should not be 200' ) )
            .catch( res => {
                assert.equal( res.status, 400 );
                assert.equal( res.response.body.error, 'unauthorized, no token provided' );
                done();
            });
    });

    it('POST request - valid token', done => {
        request
            .post('/api/roles')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(testRole)
            .then(res => {
                const newRole = res.body;
                assert.ok(newRole._id);
                testRole._id = newRole._id;
                testRole.__v = 0;
                testRoleFinal._id = newRole._id;
                testRoleFinal.__v = 0;
                done();
            })
            .catch(done);
    });

    it('GET all after POST', done => {
        request
            .get('/api/roles')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .then( res => {
                assert.deepEqual(res.body, [testRole]);
                done();
            })
            .catch(done);
    });

    it('PUT request - no token', done => {
        request
            .put(`/api/roles/${testRole._id}`)
            .send(testRoleUpd)
            .then( res => done( 'status should not be 200' ) )
            .catch( res => {
                assert.equal( res.status, 400 );
                assert.equal( res.response.body.error, 'unauthorized, no token provided' );
                done();
            });
    });

    it('PUT request - valid token', done => {
        request
            .put(`/api/roles/${testRole._id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(testRoleUpd)
            .then(res => {
                assert.deepEqual(res.body, testRole);
                done();
            })
            .catch(done);
    });

    it('GET by id', done => {
        request
            .get(`/api/roles/${testRoleFinal._id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .then( res => {
                assert.deepEqual(res.body, testRoleFinal);
                done();
            })
            .catch(done);
    });

    it('DELETE request - no token', done => {
        request
            .delete(`/api/roles/${testRoleFinal._id}`)
            .then( res => done( 'status should not be 200' ) )
            .catch( res => {
                assert.equal( res.status, 400 );
                assert.equal( res.response.body.error, 'unauthorized, no token provided' );
                done();
            });
    });

    it('DELETE request - valid token', done => {
        request
            .delete(`/api/roles/${testRoleFinal._id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .then(res => {
                assert.deepEqual(res.body, testRoleFinal);
                done();
            })
            .catch(done);
    });
});

