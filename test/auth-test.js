const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);
const app = require('../lib/app');
const request = chai.request(app);

describe('Not authorized', () => {

  it('Err when no token provided', done => {
    request
      .get('/api/ships')
      .then(res => done('Status should not be 200'))
      .catch(res => {
        assert.equal(res.status, 400);
        assert.equal(res.response.body.error, 'Unauthorized; no token provided.');
        done();
      });
  });

  it('Err when bad token provided', done => {
    request
      .get('/api/ships')
      .set('authorization', 'badToken')
      .then(res => done('Status should not be 200'))
      .catch(res => {
        assert.equal(res.status, 403);
        assert.equal(res.response.body.error, 'Unauthorized; bad token.');
        done();
      });
  });

});

const testUser = {
  username: 'Trump',
  password: 'TinyHands'
};

const badRequest = (url, send, error, done) => {
  request
    .post(url)
    .send(send)
    .then(res => done('Status should not be 200'))
    .catch(res => {
      assert.equal(res.status, 400);
      assert.equal(res.response.body.error, error);
      done();
    })
    .catch(done);
};

describe('User signup/signin', () => {

  it('Signup needs username', done => {
    badRequest('/api/auth/signup', {password: 'hello'}, 'Username and Password required.', done);
  });

  it('Signup needs a password', done => {
    badRequest('/api/auth/signup', {username: 'Billy'}, 'Username and Password required.', done);
  });

  let token = '';

  it('Signs up new users', done => {
    request
      .post('/api/auth/signup')
      .send(testUser)
      .then(res => assert.ok(token = res.body.token))
      .then(done, done);
  });

  it('Keeps usernames unique', done => {
    badRequest('/api/auth/signup', testUser, 'Username Trump already exists.', done);
  });

  it('Provides valid token', done => {
    request
      .get('/api/ships')
      .set('authorization', token)
      .then(res => assert.ok(res.body));
  });

  it('Signs users in', done => {
    request
      .post('/api/auth/signin')
      .send(testUser)
      .then(res => assert.equal(res.body.token, token));
  });

});