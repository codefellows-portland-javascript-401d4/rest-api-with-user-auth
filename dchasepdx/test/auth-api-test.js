const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');
const app = require('../lib/app');


const request = chai.request(app);

describe('user auth', () => {
  before(done => {
    const drop = () => connection.db.dropDatabase(done);
    if (connection.readyState === 1) drop();
    else connection.on('open', drop);
  });


  it('should respond with a 400 error without a token', done => {
    request
      .get('/teams')
      .then(res => done('status should not be 200'))
      .catch( res => {
        assert.equal(res.status, 400);
        assert.equal(res.response.body.error, 'unauthorized, no token provided');
        done();
      })
      .catch(done);
  });

  it('should respond with a 403 error with invalid token', done => {
    request
      .get('/teams')
      .set('token', 'bad token')
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
  username: 'testuser',
  password: 'test'
};

describe('user management', () => {
  function badRequest(url, send, error, done) {
    request
      .post(url)
      .send(send)
      .then(res => done('status should not be 200'))
      .catch(res => {
        // console.log('body or body response', res);
        assert.equal(res.status, 400);
        assert.equal(res.response.body.error, error);
        done();
      })
      .catch(done);
  }
  it('should require a username on signup', done => {
    badRequest('/auth/signup', {password: 'test'}, 'username and password are required', done);
  });

  it('should require a password on signup', done => {
    badRequest('/auth/signup', {username: 'testuser'}, 'username and password are required', done);
  });

  it('should provide a token on signup', done => {
    request
      .post('/auth/signup')
      .send(user)
      .then(res => assert.ok(token = res.body.token))
      .then(done, done);
  });

  it('shouldn\'t allow duplicate usernames', done => {
    badRequest('/auth/signup', user, 'username testuser already exists', done);
  });

  it('should attach the correct token to user on signin', done => {
    request
      .post('/auth/signin')
      .send(user)
      .then(res => assert.equal(res.body.token, token))
      .then(done, done);
  });

});
