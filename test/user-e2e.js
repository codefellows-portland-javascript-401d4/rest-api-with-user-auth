const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/mongoose-setup');
const app = require('../lib/app');

describe('user', () => {
  before(done => {
    const CONNECTED = 1;
    if(connection.readyState === CONNECTED) dropCollection();
    else connection.on('open', dropCollection);

    function dropCollection() {
      console.log('dropping collection');
      const name = 'users';
      connection.db
        .listCollections({name})
        .next((err, collectionInfo) => {
          if(!collectionInfo) return done();
          connection.db.dropCollection(name, done);
        });
    }
  });

  const request = chai.request(app);
  const testUser = {
    username: 'test',
    password: '123'
  };

  it('user sign up returns token', done => {
    request
      .post('/auth/signup')
      .send(testUser)
      .then(response => {
        assert.isOk(response.body.token);
        testUser.token = response.body.token;
        done();
      })
      .catch(done);
  });

  it('another user cannot sign up with same name', done => {
    request
      .post('/auth/signup')
      .send({username: testUser.username, password:'456'})
      .then(response => {
        done('We should have thrown an error!', response.body);
      })
      .catch(res => {
        assert.equal(res.status, 400);
        assert.equal(res.response.res.text, '400 ERROR: There is already a user named test');
        done();
      });
  });

  it('the same user can sign in and get the same token', done => {
    request
      .post('/auth/signin')
      .send(testUser)
      .then(response => {
        assert.isOk(response.body.token);
        assert.deepEqual(response.body.token, testUser.token);
        done();
      })
      .catch(done);
  });

  it('token is valid', done => {
    request
      .post('/auth/validate')
      .set('Content-Type', 'application/json')
      .set('Authorization', testUser.token)
      .then(response => {
        assert.deepEqual(response.body, {validAuth: true});
        done();
      })
      .catch(done);
  });



  after(done => {
    connection.close(done);
  });
});
