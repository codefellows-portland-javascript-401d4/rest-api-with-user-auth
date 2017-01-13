const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = require('chai').assert;
const app = require('../lib/app');
const connection = require('../lib/mongoose');

describe('auth', () => {
    before(done => {
        const drop = () => connection.db.dropDatabase(done);
        if (connection.readyState === 1) drop();
        else connection.on('open', drop);
    });

    const request = chai.request(app);

    describe('unauthorized', () => { 
        it('returns code 400 when no token provided', done => {
            request 
                .get('/api/movements/')
                .then(res => done('status code should not be 200'))
                .catch(res => {
                    assert.equal(res.status, 400);
                    assert.equal(res.response.body.error, 'unauthorized, no token provided');
                    done();
                })
                .catch(done);
        });

        it('returns code 403 when invalid token provided', done => {
            request
                .get('/api/movements/')
                .set('Authorization', 'Bearer bad token')
                .then(res => done('status should not be 200'))
                .catch(res => {
                    assert.equal(res.status, 403);
                    assert.equal(res.response.body.error, 'unauthorized, invalid token');
                    done();
                })
                .catch(done);
        });
    });

    const user = {
        username: 'remy',
        password: 'frecklefeet'
    };

    describe('user management', () => {
        function badRequest(url, send, error, done) {
            request
                .post(url)
                .send(send)
                .then(res => done('status should not be 200'))
                .catch(res => {
                    assert.equal(res.status, 400);
                    assert.equal(res.response.body.error, error);
                    done();
                })
                .catch(done);
        }

        it('requires username for signup', done => {
            badRequest('/api/auth/signup', { password: 'abc' }, 'username and password must be provided', done);
        });

        it('requires password for signup', done => {
            badRequest('/api/auth/signup', { username: 'abc' }, 'username and password must be provided', done);
        });

        let token = '';

        it('executes signup', done => {
            request
                .post('/api/auth/signup')
                .send(user)
                .then(res => assert.ok(token = res.body.token))
                .then(done, done);
        });

        it('does not allow use of existing username', done => {
            badRequest('/api/auth/signup', user, `username ${ user.username } already exists`, done);
        });

        it('ensures token is valid', done => {
            request
                .get('/api/movements')
                .set('Authorization', `Bearer ${ token }`)
                .then(res => assert.ok(res.body))
                .then(done, done);
        });

        it('executes signin', done => {
            request
                .post('/api/auth/signin')
                .send(user)
                .then(res => assert.equal(res.body.token, token))
                .then(done, done);
        });
    });
});
