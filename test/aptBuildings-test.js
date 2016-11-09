
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');
const assert = chai.assert;
chai.use(chaiHttp);

const path = require('path');
// load test env variables
require('dotenv').load({ path: path.join(__dirname, '.env.test') });

const connection = require('../lib/mongoose-config');
const app = require('../lib/app');

describe('Validating Apartment Buildings', () => {

    before( done => {
        const CONNECTED = 1;
        if (connection.readyState === CONNECTED) dropCollection();
        else connection.on('open', dropCollection);

        function dropCollection(){
            const name = 'aptbldgs';
            connection.db
                .listCollections({ name })
                .next( (err, collinfo) => {
                    if (!collinfo) return done();
                    connection.db.dropCollection(name, done);
                });
        }
    });

    const testAptBldg = {
        name: 'Test Apartment Building',
        location: 'random avenue',
        nbrunits: 20,
        vacantunits: 0
    };

    const testAptBldgUpd = {
        location: 'specific street',
        vacantunits: 3
    };

    const testAptBldgFinal = {
        name: 'Test Apartment Building',
        location: 'specific street',
        nbrunits: 20,
        vacantunits: 3
    };

    const testAptBldg2 = {
        name: 'Test Apartment Building 2',
        location: '2 random avenue',
        nbrunits: 22,
        vacantunits: 2
    };

    const userAdmin = {
        username: 'Test Admin Bldgs',
        password: 'ThePWD',
        roles: ['admin']
    };

    const userSuperUser = {
        username: 'Test Super Bldgs',
        password: 'SuperPWD',
        roles: ['super-user']
    };

    const userReadOnly = {
        username: 'Test Read Only Bldgs',
        password: 'ReadPWD',
        roles: ['read-only']
    };

    const request = chai.request(app);

    let tokenAdmin = '',
        tokenSuper = '',
        tokenRead = '';

    before( done => {
        request
            .post( '/api/auth/signup' )
            .send( userAdmin )
            .then( res => assert.ok( tokenAdmin = res.body.token ) )
            .then( done => {
                request
                    .post( '/api/auth/signup' )
                    .send( userSuperUser )
                    .then( res => assert.ok( tokenSuper = res.body.token ) )
                    .then( done => {
                        request
                            .post( '/api/auth/signup' )
                            .send( userReadOnly )
                            .then( res => assert.ok( tokenRead = res.body.token ) )
                            .then(done => {
                                done();
                            })
                            .catch(done);
                    });
            });
    });

    it('GET all without token', done => {
        request
            .get('/api/aptbldgs')
            .then( res => done( 'status should not be 200' ) )
            .catch( res => {
                assert.equal( res.status, 400 );
                assert.equal( res.response.body.error, 'unauthorized, no token provided' );
                done();
            });
    });

    it('GET all with token', done => {
        // NOTE: all 3 users can GET
        request
            .get('/api/aptbldgs')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .then( res => {
                assert.deepEqual(res.body, []);
                done();
            })
            .catch(done);
    });

    it('POST request with invalid token', done => {
        request
            .post('/api/aptbldgs')
            .set('Authorization', `Bearer ${tokenRead}`)
            .send(testAptBldg)
            .then(res => done( 'status should not be 200' ) )
            .catch( res => {
                assert.equal( res.status, 400 );
                assert.equal( res.response.body.error, 'not authorized' );
                done();
            });
    });

    it('POST request with valid token', done => {
        request
            .post('/api/aptbldgs')
            .set('Authorization', `Bearer ${tokenSuper}`)
            .send(testAptBldg)
            .then(res => {
                const aptBldg = res.body;
                assert.ok(aptBldg._id);
                testAptBldg._id = aptBldg._id;
                testAptBldg.__v = 0;
                testAptBldgFinal._id = aptBldg._id;
                testAptBldgFinal.__v = 0;
                done();
            })
            .catch(done);
    });

    it('GET all after POST', done => {
        request
            .get('/api/aptbldgs')
            .set('Authorization', `Bearer ${tokenRead}`)
            .then( res => {
                assert.deepEqual(res.body, [testAptBldg]);
                done();
            })
            .catch(done);
    });

    it('PUT request - invalid token', done => {
        request
            .put(`/api/aptbldgs/${testAptBldg._id}`)
            .set('Authorization', `Bearer ${tokenRead}`)
            .send(testAptBldgUpd)
            .then(res => done( 'status should not be 200' ) )
            .catch( res => {
                assert.equal( res.status, 400 );
                assert.equal( res.response.body.error, 'not authorized' );
                done();
            });
    });

    it('PUT request - valid token', done => {
        request
            .put(`/api/aptbldgs/${testAptBldg._id}`)
            .set('Authorization', `Bearer ${tokenSuper}`)
            .send(testAptBldgUpd)
            .then(res => {
                assert.deepEqual(res.body, testAptBldg);
                done();
            })
            .catch(done);
    });

    it('GET by id', done => {
        request
            .get(`/api/aptbldgs/${testAptBldgFinal._id}`)
            .set('Authorization', `Bearer ${tokenSuper}`)
            .then( res => {
                testAptBldgFinal.apartments = [];
                assert.deepEqual(res.body, testAptBldgFinal);
                delete testAptBldgFinal.apartments;
                done();
            })
            .catch(done);
    });

    it('Vacancies request', done => {
        request
            .post('/api/aptbldgs')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(testAptBldg2)
            .then(res => {
                const aptBldg = res.body;
                assert.ok(aptBldg._id);
                testAptBldg2._id = aptBldg._id;
                testAptBldg2.__v = 0;
            })
            .catch(done);

        request
            .get('/api/aptbldgs/vacancies')
            .set('Authorization', `Bearer ${tokenRead}`)
            .then( res => {
                assert.deepEqual(res.body, {'Total Vacant Apartments': 5});
                done();
            })
            .catch(done);
            
    });

    it('DELETE request - invalid token', done => {
        request
            .delete(`/api/aptbldgs/${testAptBldg._id}`)
            .set('Authorization', `Bearer ${tokenRead}`)
            .then(res => done( 'status should not be 200' ) )
            .catch(res => {
                assert.equal( res.status, 400 );
                assert.equal( res.response.body.error, 'not authorized' );
                done();
            });
    });

    it('DELETE request - valid token', done => {
        request
            .delete(`/api/aptbldgs/${testAptBldg._id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .then(res => {
                assert.deepEqual(res.body, testAptBldgFinal);
                done();
            })
            .catch(done);
    });

});

