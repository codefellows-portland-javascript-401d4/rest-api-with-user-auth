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
  const tokenUser = { username: 'Token User', password: 'Password' };

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
        assert.isOk(token = res.text);
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
        assert.equal(res.text, error);
        done();
      });
  });

});