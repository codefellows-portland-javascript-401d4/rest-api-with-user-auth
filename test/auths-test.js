const chai = require( 'chai' );
const chaiHttp = require( 'chai-http' );
const assert = chai.assert;
chai.use( chaiHttp );

const path = require('path');
// load test env variables
require('dotenv').load({ path: path.join(__dirname, '.env.test') });


// start the db...
const connection = require( '../lib/mongoose-config' );

const app = require( '../lib/app' );

describe( 'authentication checks', () => {

	// you can drop the whole database (instead of one collection):
    before( done => {
        const drop = () => connection.db.dropDatabase( done );
        if ( connection.readyState === 1 ) drop();
        else connection.on( 'open', drop );
    });

    const request = chai.request(app);

    describe( 'various unauthorized', () => {

        it( '400 with no token', done => {
            request
                .get( '/api/aptBldgs' )
                .then( res => done( 'status should not be 200' ) )
                .catch( res => {
                    assert.equal( res.status, 400 );
                    assert.equal( res.response.body.error, 'unauthorized, no token provided' );
                    done();
                })
                .catch( done );
        });

        it( '403 with invalid token', done => {
            request
                .get( '/api/aptBldgs' )
                .set( 'Authorization', 'Bearer badtoken' )
                .then( res => done( 'status should not be 200' ) )
                .catch( res => {
                    assert.equal( res.status, 403 );
                    assert.equal( res.response.body.error, 'unauthorized, invalid token' );
                    done();
                })
                .catch( done );
        });

    });

    const user = {
        username: 'Test Ahsterone',
        password: 'TooMuch',
        roles: ['admin']
    };

    const user2 = {
        username: null,
        password: 'TooMuch',
        roles: ['admin']
    };

    const user3 = {
        username: 'Test Ahsterone',
        password: null,
        roles: ['admin']
    };

    describe( 'user management', () => {

        function badRequest( url, send, error, done ) {
            request
                .post( url )
                .send( send )
                .then( res => done( 'status should not be 200' ) )
                .catch( res => {
                    assert.equal( res.status, 400 );
                    assert.equal( res.response.body.error, error );
                    done();
                })
                .catch( done );
        }

        it( 'signup requires username', done => {
            badRequest( '/api/auth/signup', { password: 'abc' }, 'username and password are required', done );
        });

        it( 'signup requires password', done => {
            badRequest( '/api/auth/signup', { username: 'abc' }, 'username and password are required', done );
        });

        let token = '';

        it( 'signup', done => {
            request
                .post( '/api/auth/signup' )
                .send( user )
                .then( res => assert.ok( token = res.body.token ) )
                .then( done, done );
        });

        it( 'cannot use same username', done => {
            badRequest( '/api/auth/signup', user, 'username Test Ahsterone already exists', done );
        });

        it( 'token is valid', done => {
            request
                .get( '/api/aptBldgs' )
                .set('Authorization', `Bearer ${token}` )
                .then( res => assert.ok( res.body ) )
                .then( done, done );
        });

        it( 'signin requires username', done => {
            badRequest( '/api/auth/signin', user2, 'Missing username or password', done );
        });

        it( 'signin requires password', done => {
            badRequest( '/api/auth/signin', user3, 'Missing username or password', done );
        });

        it( 'signin', done => {
            request
                .post( '/api/auth/signin' )
                .send( user )
                .then( res => assert.equal( res.body.token, token ) )
                .then( done, done );
        });

    });
	
});