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

describe('Validating ApartmentUnits', () => {

    before( done => {
        const CONNECTED = 1;
        if (connection.readyState === CONNECTED) dropCollection();
        else connection.on('open', dropCollection);

        function dropCollection(){
            const name = 'apartmentunits';
            connection.db
                .listCollections({ name })
                .next( (err, collinfo) => {
                    if (!collinfo) return done();
                    connection.db.dropCollection(name, done);
                });
        }
    });

    const userAdmin = {
        username: 'Test Admin Apts',
        password: 'ThePWD',
        roles: ['admin']
    };

    const userSuperUser = {
        username: 'Test Super Apts',
        password: 'SuperPWD',
        roles: ['super-user']
    };

    const userReadOnly = {
        username: 'Test Read Only Apts',
        password: 'ReadPWD',
        roles: ['read-only']
    };

    const testAptUnit = {
        name: 'Test Apartment',
        location: 'random floor',
        nbrbdrms: 2,
        nbrbaths: 2,
        totalsize: 1500,
        bldgId: '581d1eee6823e51ab3d78fbe'
    };

    const testAptUnitUpd = {
        location: 'specific floor',
        totalsize: 100
    };

    const testAptUnitFinal = {
        name: 'Test Apartment',
        location: 'specific floor',
        nbrbdrms: 2,
        nbrbaths: 2,
        totalsize: 100,
        bldgId: '581d1eee6823e51ab3d78fbe'
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
                            .then(done)
                            .catch(done);
                    });
            });
    });

    it('GET all without token', done => {
        request
            .get('/api/apartmentunits')
            .then( res => done( 'status should not be 200' ) )
            .catch( res => {
                assert.equal( res.status, 400 );
                assert.equal( res.response.body.error, 'unauthorized, no token provided' );
                done();
            });
    });

    it('GET all with token', done => {
        // NOTE: all 3 test users will be able to get data.
        request
            .get('/api/apartmentunits')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .then( res => {
                assert.deepEqual(res.body, []);
                done();
            })
            .catch(done);
    });

    it('POST request invalid token', done => {
        request
            .post('/api/apartmentunits')
            .set('Authorization', `Bearer ${tokenRead}`)
            .send(testAptUnit)
            .then(res => done( 'status should not be 200' ) )
            .catch( res => {
                assert.equal( res.status, 400 );
                assert.equal( res.response.body.error, 'not authorized' );
                done();
            });
    });

    it('POST request valid token', done => {
        request
            .post('/api/apartmentunits')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send(testAptUnit)
            .then(res => {
                const aptUnit = res.body;
                assert.ok(aptUnit._id);
                testAptUnit._id = aptUnit._id;
                testAptUnit.__v = 0;
                testAptUnitFinal._id = aptUnit._id;
                testAptUnitFinal.__v = 0;
                done();
            })
            .catch(done);
    });

    it('GET by id', done => {
        request
            .get(`/api/apartmentunits/${testAptUnit._id}`)
            .set('Authorization', `Bearer ${tokenSuper}`)
            .then( res => {
                assert.deepEqual(res.body, testAptUnit);
                done();
            })
            .catch(done);
    });

    it('GET all after POST', done => {
        request
            .get('/api/apartmentunits')
            .set('Authorization', `Bearer ${tokenSuper}`)
            .then( res => {
                assert.deepEqual(res.body, [testAptUnit]);
                done();
            })
            .catch(done);
    });

    it('PUT request with invalid token', done => {
        request
            .put(`/api/apartmentunits/${testAptUnit._id}`)
            .set('Authorization', `Bearer ${tokenRead}`)
            .send(testAptUnitUpd)
            .then(res => done( 'status should not be 200' ) )
            .catch( res => {
                assert.equal( res.status, 400 );
                assert.equal( res.response.body.error, 'not authorized' );
                done();
            });
    });

    it('PUT request with valid token', done => {
        request
            .put(`/api/apartmentunits/${testAptUnit._id}`)
            .set('Authorization', `Bearer ${tokenSuper}`)
            .send(testAptUnitUpd)
            .then(res => {
                assert.deepEqual(res.body, testAptUnit);
                done();
            })
            .catch(done);
    });

    it('DELETE request with invalid token', done => {
        request
            .delete(`/api/apartmentunits/${testAptUnit._id}`)
            .set('Authorization', `Bearer ${tokenRead}`)
            .then(res => done( 'status should not be 200' ) )
            .catch( res => {
                assert.equal( res.status, 400 );
                assert.equal( res.response.body.error, 'not authorized' );
                done();
            });
    });

    it('DELETE request with valid token', done => {
        request
            .delete(`/api/apartmentunits/${testAptUnit._id}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .then(res => {
                assert.deepEqual(res.body, testAptUnitFinal);
                done();
            })
            .catch(done);
    });

});

