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

const user = {
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
    });
};

describe('User signup/signin', () => {

  it('Signup needs username', done => {
    badRequest('/api/auth/signup', {password: 'hello'}, 'Username and Password required.', done);
  });

  it('Signup needs a password', done => {
    badRequest('/api/auth/signup', {username: 'Billy'}, 'Username and Password required.', done);
  });

});