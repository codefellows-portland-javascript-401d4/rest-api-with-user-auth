const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');

const app = require('../lib/app');

describe('auth', () => {
    before(done => {
        const drop = () =>  connection.db.dropDatabase(done);
        if (connection.readyState === 1) { drop(); }
        else {connection.on('open', drop);}
    });

    const request = chai.request(app);

    describe('unauthorized', () => {
        it( ' 400 with no token', done => {
            request
                .get('/members')
                .then(res => done('status should not be 200'))
                .catch(res => {
                    assert.equal(res.status, 400);
                    assert.equal(res.response.body.error, 'unauthorized, no token provided');
                    done();
                })
                .catch(done);
        });

        it('403 with invalid token', done => {
            request
                .get('/members')
                .set('Authorization', 'badtoken')
                .then(res => done('status should not be 200'))
                .catch( res => {
                    assert.equal(res.status, 403);
                    assert.equal(res.response.body.error, 'unauthorized, invalid token');
                    done();
                })
                .catch(done);
        });

    });

    const user = {
        username: 'CoolKid',
        password: 'SecretCode'
    };

    describe('user management', () => {
        function badRequest(url, send, error, done) {
            request
                .post(url)
                .send(send)
                .then(res => done('status should not be ok'))
                .catch(res => {
                    assert.equal(res.status, 400);
                    assert.equal(res.response.body.error, error);
                    done();
                })
                .catch(done);
        }

        it('requires username at signup', done => {
            badRequest('/auth/signup', {password: 'abc'}, 'username and password must be supplied', done);
        });

        it('requires a password at signup', done => {
            badRequest('/auth/signup', {username: 'abc'}, 'username and password must be supplied', done);}
        );

        let token = '';

        it('signup', done => {
            request
                .post('/auth/signup')
                .send(user)
                .then(res => {
                    assert.ok( token = res.body.token);
                    done();
                })
                .catch(done);
        });

        it('cannot duplicate username', done => {
            badRequest('/auth/signup', user, 'username CoolKid already exists', done);
        });

        it('token is valid', done => {
            request
                .get('/members')
                .set('Authorization', token)
                .then(res => assert.ok(res.body))
                .then(done())
                .catch(done);
        });

        it('signin', done => {
            request
                .post('/auth/signin')
                .send(user)
                .then(res => {
                    assert.equal(res.body.token, token);
                })
                .then(done, done);
        });
    });
});