const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);
const connection = require('../lib/mongoose');
const app = require('../lib/app');

describe('auth', () => {
    const req = chai.request(app);

    before(done => {
        console.log('readyState before', connection.readyState);
        const drop = () => connection.db.dropDatabase(done);
        if (connection.readyState === 1) drop();
        else connection.once('open', drop);
        console.log('readyState after', connection.readyState);
    });

    describe('unauthorized', () => {
        it('gives 400 error if no token', done => {
            req
                .get('/countries')
                //eslint-disable-next-line no-unused-vars
                .then(res => done('status should not be 200'))
                .catch(res => {
                    assert.equal(res.status, 400);
                    assert.equal(res.response.body.error, 'unauthorized, no token provided');
                    done();
                })
                .catch(done);
        });

        it('gives 403 error if token invalid', done => {
            req
                .get('/countries')
                .set('authorization', 'Bearer badtoken')
                //eslint-disable-next-line no-unused-vars
                .then(res => done('status should not be 200'))
                .catch(res => {
                    assert.equal(res.status, 403);
                    assert.equal(res.response.body.error, 'unauthorized, invalid token');
                    done();
                })
                .catch(done);
        });
    });

    const user1 = {
        username: 'user1',
        password: 'password1',
        roles: ['admin', 'super-user']
    };

    describe('user management', () => {

        function badRequest(url, userData, error, done) {
            req
                .post(url)
                .send(userData)
                //eslint-disable-next-line no-unused-vars
                .then(res => done('status should not be 200'))
                .catch(res => {
                    assert.equal(res.status, 400);
                    assert.equal(res.response.body.error, error);
                    done();
                })
                .catch(done);
        }

        it('username required at signup', done => {
            badRequest('/auth/signup', {password: 'password'}, 'username and password required', done);
        });

        it('password required at signup', done => {
            badRequest('/auth/signup', {username: 'user'}, 'username and password required', done);
        });

        let token = '';

        it('signs a user up', done => {
            req
                .post('/auth/signup')
                .send(user1)
                .then(res => {
                    token = res.body.token;
                    req
                        .post('/auth/validate')
                        .set('authorization', `Bearer ${res.body.token}`)
                        .then(res => {
                            assert.isOk(res.body.valid);
                            done();
                        })
                        .catch(done);
                });
        });

        it('can\'t use same username', done => {
            badRequest('/auth/signup', user1, 'username user1 already exists', done);
        });

        it('token is valid', done => {
            req
                .get('/countries')
                .set('authorization', `Bearer ${token}`)
                .then(res => assert.ok(res.body))
                .then(done, done);
        });

        it('signs a user in', done => {
            req
                .post('/auth/signin')
                .send(user1)
                .then(res => {
                    req
                        .post('/auth/validate')
                        .set('authorization', `Bearer ${res.body.token}`)
                        .then(res => {
                            assert.isOk(res.body.valid);
                            done();
                        })
                        .catch(done);
                });
        });

        const user2 = {
            username: 'user2',
            password: 'password2'
        };

        it('prevents an unauthorized user from accessing forbidden places', done => {
            req
                .post('/auth/signup')
                .send(user2)
                .then(res => {
                    req
                        .get('/countries')
                        .set('authorization', `Bearer ${res.body.token}`)
                        //eslint-disable-next-line no-unused-vars
                        .then(res => {
                            done('should not be able to access');
                        })
                        .catch(res => {
                            assert.equal(res.status, 400);
                            assert.equal(res.response.body.error, 'not authorized roles');
                            done();
                        })
                        .catch(done);
                });
        });
    });
});