/** Created by Gloria Anholt on 11/7/16. **/

const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost/testDB';
mongoose.Promise = Promise;
mongoose.connect( dbURI );
const connection = mongoose.connection;

const app = require('../lib/app');


describe('User authentication routes', () => {

  const server = chai.request(app);
  let token = '';
  let adminToken = '';
  const tokenUser = { username: 'Token User', password: 'Password' };
  const admin = { username: 'Superduper User', password: 'Passw0rd', roles: ['admin'] };

  before(done => {

    const CONNECTED = 1;
    if (connection.readyState === CONNECTED) dropCollection();
    else (connection.on('open', dropCollection));

    function dropCollection() {
      const name = 'testDB';
      connection.db.dropDatabase(name, done);
    }
  });

  before(done => {
    // Set up a tokened user for later tests
    server
      .post('/api/auth/signup')
      .send(tokenUser)
      .end((err, res) => {
        if (err) done(err);
        let response = JSON.parse(res.text);
        assert.isOk(token = response.token);
        done();
      });
  });

  before(done => {
    // Set up a admin for later tests
    server
      .post('/api/auth/signup')
      .send(admin)
      .end((err, res) => {
        if (err) done(err);
        let response = JSON.parse(res.text);
        adminToken = response.token;
        assert.isOk(adminToken);
        done();
      });
  });

  it('requires a username', done => {

    const noName = { password: 'Password' };
    const error = '{"error":"Username and password are required."}';

    server
      .post('/api/auth/signup') // expecting an error
      .send(noName)
      .end((err, res) => {
        assert.equal(res.text, error);
        done();
      });

  });

  it('requires a password', done => {

    const noPass = { username: 'Whats in a name' };
    const error = '{"error":"Username and password are required."}';

    server
      .post('/api/auth/signup') // expecting an error
      .send(noPass)
      .end((err, res) => {
        assert.equal(res.text, error);
        done();
      });
  });

  it('receives a token when signing up', done => {

    const firstUser = {
      username: 'First User',
      password: 'Password'
    };

    const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

    server
      .post('/api/auth/signup')
      .send(firstUser)
      .end((err, res) => {
        let tokenBody = JSON.parse(res.text).token;
        let tokenArray = tokenBody.split('.');
        let receivedToken = tokenArray[0];
        assert.equal(receivedToken, sampleToken);
        done();
      });

  });

  it('requires a unique username', done => {

    const duplicateUser = {
      username: 'Token User',
      password: 'Password'
    };

    const error = `{"error":"Username ${duplicateUser.username} already taken. Please try a different name."}`;

    server
      .post('/api/auth/signup') // expecting an error
      .send(duplicateUser)
      .end((err, res) => {
        assert.equal(err.status, 400);
        assert.equal(err.response.text, error);
        done();
      });
  });

  it('requires a token to hit the /me route', done => {

    const expectedResults = '{"username":"Token User","favoriteAuthors":[],"favoriteBooks":[]}';

    server
      .get('/api/auth/me')
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.text, expectedResults);
        done();
      })
      .catch(done);
  });

  it('requires a admin access to hit the /admin route', done => {

    server
      .get('/api/auth/admin')
      .set('Authorization', adminToken)
      .then(res => {
        assert.isAbove(res.text.length, 0);
        done();
      })
      .catch(done);

  });


});