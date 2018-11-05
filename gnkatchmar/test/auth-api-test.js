const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');

const app = require('../lib/app');

describe('authorization', () => {

  before(done => {
    const drop = () => connection.db.dropDatabase(done);
    if (connection.readyState === 1) drop();
    else connection.on('open', drop);
  });

  const request = chai.request(app);

  describe('check for unauthorized user', () => {

    it('400 with no token', done => {
      request
				.get('/api/players')
				.then(res => done('status should not be 200'))
				.catch(res => {
  assert.equal(res.status, 400);
  assert.equal(res.response.body.error, 'unauthorized, no token provided');  //message from ensure-auth.js
  done();
})
				.catch(done);
    });

    it('403 with invalid token', done => {
      request
				.get('/api/teams')
				.set('authorization', 'badtoken')
				.then(res => done('status should not be 200'))
				.catch(res => {
  assert.equal(res.status, 403);
  assert.equal(res.response.body.error, 'unauthorized, invalid token');  //message from ensure-auth.js
  done();
})
				.catch(done);
    });

  });

  const user = {
    username: 'Giants Fan',
    password: 'Buster'
  };

  describe('user management', () => {

    //used for three of the following error message confirmations
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

    it('register requires username', done => {
      badRequest('/api/auth/register', {password: 'abc'}, 'username and password must be supplied', done);  //auth.js
    });		
		
    it('register requires password', done => {
      badRequest('/api/auth/register', {username: 'abc'}, 'username and password must be supplied', done); //auth.js
    });

    let token = '';

    it('register for first time user', done => {
      request
				.post('/api/auth/register')
				.send(user)
				.then(res => assert.ok(token = res.body.token))
				.then(done, done);
    });

    it('can\'t use same username', done => {
      badRequest('/api/auth/register', user, 'username Giants Fan already exists', done);
    });

    it('signin for returning user', done => {
      request
				.post('/api/auth/signin')
				.send(user)
				.then(res => assert.equal(res.body.token, token))
				.then(done, done);
    });

  });  //2nd nested Describe
	
});  //Initial Describe