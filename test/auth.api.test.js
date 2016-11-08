const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../lib/app');
const connection = require('../lib/mongooseSetup');
chai.use(chaiHttp);
mongoose.Promise = Promise;

describe('Checking access to anime DB with user authentication', () => {
    before( done => {
        const dropAuth = () => connection.db.dropCollection('users', () => {
            done();
        });
        if (connection.readyState === 1) dropAuth();
        else connection.on('open', dropAuth);
    });

    const request = chai.request(app);

    describe('checking access rights', () => {
        it('400 with no token', done => {
            request
                .get('/animechars')
                .then(res => {
                    done('status should not be 200');
                })
                .catch(res => {
                    assert.equal(res.status, 400);
                    assert.equal(res.response.body.error, 'unauthorized, no token provided');
                    done();
                })
                .catch(done);
        });

        it('403 with a bad token', done => {
            request
                .get('/animechars')
                .set('Authorization', 'Bearer hahaha')
                .then( res => {
                    done('status should not be 200');
                })
                .catch(res => {
                    assert.equal(res.status, 403);
                    assert.equal(res.response.body.error, 'unauthorized, invalid token');
                    done();
                })
                .catch(done);
        });
    });

    const newUser = {
        username: 'Shinji Ikari',
        password: 'Evangelion'
    };

    describe('user access rights', done => {
        function badRequest(url, send, error, done) {
            request
                .post(url)
                .send(send)
                .then(res => {
                    done('status should not be 200');
                })
                .catch(res => {
                    assert.equal(res.status, 400);
                    assert.equal(res.response.body.error, error);
                    done();
                })
                .catch(done);
        };

        it('signup requires a valid username', done => {
            badRequest('/users/signup', {password: 'whatever'}, 'username and password must be given', done);
        });

        it('signup requires a valid password', done => {
            badRequest('/users/signup', {username: 'whatever'}, 'username and password must be given', done);
        });

        let token = '';

        it('signup a new use and retrieve a token', done => {
            request
                .post('/users/signup')
                .send(newUser)
                .then(res => {
                    assert.isOk(res.body.token);
                    token = res.body.token;
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done();
                });
        });

        it('should error out if a user with the same name tries to sign up', done => {
            badRequest('/users/signup', newUser, 'username Shinji Ikari already exists!', done);
        });

        it('the token returned from the server should be valid', done => {
            request
                .post('/users/validate')
                .set('Authorization', `Bearer ${token}`)
                .then(res => {
                    assert.deepEqual(res.body, {valid: true});
                    done();
                })
                .catch(done);
        });

        it('the token should now work for the rest of the API requests to animechars', done => {
            request
                .get('/animechars')
                .set('Authorization', `Bearer ${token}`)
                .then(res => {
                    assert.isOk(res.body);
                    done();
                })
                .catch(done);
        });

        it('checks that when I sign in, I get the same token', done => {
            request
                .post('/users/signin')
                .send(newUser)
                .then(res => {
                    assert.isOk(res.body.token);
                    done();
                })
                .catch(done);
        });
    });
});