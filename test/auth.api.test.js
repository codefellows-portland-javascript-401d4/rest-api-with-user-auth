const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('chai').assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');
const app = require('../lib/app');

describe('auth', () => {

  before(done => {
    const drop = () => connection.db.dropDatabase(done);
    if (connection.readState === 1) drop();
    else connection.on('open', drop);
  });

  const request = chai.request(app);

  describe('unauthorized', () => {

    it('400 with no token', done => {
      request
        .get('/api/coaches')
        .then(res => done(res, 'status should not be 200'))
        .catch(res => {
          assert.equal(res.status, 400);
          assert.equal(res.response.body.error, 'unauthorized, no token provided');
          done();
        })
        .catch(done);
    });

    it('403 with invalid token', done => {
      request
        .get('/api/coaches')
        .set('Authorization', 'Bearer badtoken')
        .then(res => done(res, 'status should not be 200'))
        .catch(res => {
          assert.equal(res.status, 403);
          assert.equal(res.response.body.error, 'unauthorized, invalid token');
          done();
        })
        .catch(done);
    });

    const user = {
      username: 'robot',
      password: 'green'
    };

    describe('user management', () => {

      function badRequest(url, send, error, done) {
        request
          .post(url)
          .send(send)
          .then(res => done(res, 'status should not be okay'))
          .catch(res => {
            assert.equal(res.status, 400);
            assert.equal(res.response.body.error, error);
            done();
          })
          .catch(done);
      }

      it('signup requires username', done => {
        badRequest('/api/auth/signup', { username: 'Pete' }, 'username and password must be entered', done);
      });

      it('signup requires password', done => {
        badRequest('/api/auth/signup', { password: 'candy' }, 'username and password must be entered', done);
      });

      let token = '';

      it('signup', done => {
        request
          .post('/api/auth/signup')
          .send(user)
          .then(res => {
            assert.ok(token = res.body.token);
            done();
          })
          .catch(done);
      });

      it('cannot use the same username', done => {
        badRequest('/api/auth/signup', user, 'username robot has been used', done);
      });

      it('token is valid', done => {
        request
          .get('/api/coaches')
          .set('Authorization', `Bearer ${token}`)
          .then(res => assert.ok(res.body))
          .then(done, done);
      });

      it('signin', done => {
        request
          .post('/api/auth/signin')
          .send(user)
          .then(res => assert.ok(res.body.token))
          .then(done, done);
      });

    });


  });
});