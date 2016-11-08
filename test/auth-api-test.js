const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');
const app = require('../lib/app');

describe('user auth', () => {
  before(done => {
    const drop = () => connection.db.dropDatabase(done);
    if (connection.readyState === 1) drop();
    else connection.on('open', drop);
  });

  const request = chai.request(app);

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
        assert.equal(res.status, 400);
        assert.equal(res.response.body.error, error);
        done();
      })
      .catch(done);
  }
});
