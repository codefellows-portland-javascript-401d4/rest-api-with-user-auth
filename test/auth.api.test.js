const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('./mongoosetest-setup');

const app = require('../lib/app');

describe('auth', () => {
    before(done => {
        const drop = () => connection.db.dropDatabase(done);
        if(connection.readyState === 1) drop();
        else connection.on('open', drop);
    });

    const request = chai.request(app);

    describe('unauthorized', () => {
        it( '400 with no token', done => {
            request
                .get('/characters')
                .then( res => done( 'status should not be 200' ) )
                .catch( res => {
                    assert.equal(res.status, 400);
                    assert.equal(res.response.body.error, 'unauthorized, no token provided');
                    done();
                })
                .catch(done);
        });

        it('403 with an invalid token', done => {
            request 
                .get('/characters')
                .set('Authorization', 'Bearer badtoken')
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
        username: 'Yellow River',
        password: 'IPFreely'
    };

    const user2 = {
        username: 'UnderTheBleachers',
        password: 'SeyMoreButts',
        roles: ['admin']
    }

    describe('user management', () => {
        function badRequest(url, send, error, done){
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

        it('signup requires username', done => {
            badRequest('/auth/signup', { password: 'abd' }, 'username and password must be supplied', done)
        })

        it('signup requires password', done => {
            badRequest('/auth/signup', { username: 'abd' }, 'username and password must be supplied', done)
        })

        let token = '';
        let token2 = '';

        it('signup', done => {
            request 
                .post('/auth/signup')
                .send(user)
                .then(res => assert.ok(token = res.body.token))
                .then(done, done);
        });

        it('no repeat username', done => {
            badRequest('/auth/signup', user, 'username Yellow River already exists', done);
        });

        it('token is valid', done => {
            request 
                .get('/characters')
                .set('Authorization', `Bearer ${token}`)
                .then(res => assert.ok(res.body))
                .then(done, done);
        });

        it('signin', done => {
            request
                .post('/auth/signin')
                .send(user)
                .then(res => assert.equal(res.body.token, token))
                .then(done, done);
        });

        it('signup with admin', done => {
            request
                .post('/auth/signup')
                .send(user2)
                .then(res => assert.ok(token2 = res.body.token))
                .then(done, done);
        });

        it('admin role required for books', done => {
            request 
                .get('/books')
                .set('Authorization', `Bearer ${token}`)
                .then(res => done('status should not be 200'))
                .catch(res => {
                    assert.equal(res.status, 400);
                    assert.equal(res.response.body.error, 'not authorized');
                    done();
                });
        });

        it('access books with admin', done => {
            request 
                .get('/books')
                .set('Authorization', `Bearer ${token2}`)
                .then(res => assert.ok(res.body))
                .then(done, done);
        });

    });
});