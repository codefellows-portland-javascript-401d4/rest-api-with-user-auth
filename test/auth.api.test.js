require('dotenv').load();
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');

const app = require('../lib/app');

describe('auth', () => {
  before(done => {
    const drop = () => connection.db.dropDatabase(done);
    if (connection.readyState === 1) drop();
    else connection.on('open', drop);
  });

  const request = chai.request(app);

  describe('unauthorized', () => {
    it('400 with no token', done => {
      request
        .get('/api/records/')
        .then(res => done('status should not be 200'))
        .catch(res => {
          assert.equal(res.status, 400);
          assert.equal(res.response.body.error, 'Unauthorized: No token provided');
          done();
        })
        .catch(done);
    });

    it('403 with invalid token', done => {
      request
        .get('/api/records/')
        .set('Authorization', 'Bearer invalidToken')
        .then(res => done('status should not be 200'))
        .catch(res => {
          assert.equal(res.status, 403);
          assert.equal(res.response.body.error, 'Unauthorized: Invalid token');
          done();
        })
        .catch(done);
    });
  });

  const user = {
    username: 'Groucho Grimly',
    password: 'grouchospassword'
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

    it('signup requires username', done => {
      badRequest('/api/auth/signup', {password: 'abc'}, 'username and password are required', done);
    });

    it('signup requires password', done => {
      badRequest('/api/auth/signup', {username: 'abc'}, 'username and password are required', done);
    });

    let token = '';

    it('signup', done => {
      request
        .post('/api/auth/signup')
        .send(user)
        .then(res => assert.ok(token = res.body.token))
        .then(done, done);
    });

    it('unique username required', done => {
      badRequest('/api/auth/signup', user, `username ${user.username} already in use`, done);
    });

    it('token is valid', done => {
      request
        .get('/api/records')
        .set('Authorization', `Bearer ${token}`)
        .then(res => assert.ok(res.body))
        .then(done, done);
    });

    it('signin', done => {
      request
        .post('/api/auth/signin')
        .send(user)
        .then(res => assert.equal(res.body.token, token))
        .then(done, done);
    });

  });
});