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

  before(done => {

    const CONNECTED = 1;
    if (connection.readyState === CONNECTED) dropCollection();
    else (connection.on('open', dropCollection));

    function dropCollection() {
      const name = 'testDB';
      connection.db
        .listCollections({ name })
        .next((err, collInfo) => {
          if (!collInfo) return done();
          connection.db.dropCollection(name, done);
        });
    }
  });

  it('requires a username', done => {

    const noPass = {
      password: 'Password'
    };

    const error = '{"error":"Username and password are required."}';

    server
      .post('/api/auth/signup') // expecting an error
      .send(noPass)
      .end((err, res) => {
        assert.equal(res.text, error);
        done();
      });

  });

  xit('requires a password', done => {
  });

  xit('requires a unique username', done => {
  });

});