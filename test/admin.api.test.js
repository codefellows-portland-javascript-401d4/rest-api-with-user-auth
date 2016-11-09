const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');

const app = require('../lib/app');

describe('Admin: ', () => {

  before( done => {
    const drop = () => connection.db.dropDatabase( done );
    if (connection.readyState === 1) drop();
    else connection.on('open', drop);
  });

  const request = chai.request(app);

  it('Sends 400 when not authorized as Admin', done => {

    const user = {
      username: 'somebody',
      password: 'password'
    };

    const quire = {
      name: 'quire',
      type: 'visual',
      genre: 'mixed media',
      shows: 105
    };

    let token = '';

    request
      .post('/api/auth/signup')
      .send(user)
      .then(res => {
        assert.ok(res.body.token);
        token = res.body.token;
      })
      .then(res => {
        return request
          .post('/api/artists')
          .set('authorization', token)
          .send(quire);
      })
      .then(res => {
        return request
          .delete(`/api/artists/${quire._id}`)
          .set('authorization', token)
          .then(res => done('This should fail, not be 200'))
          .catch(res => {
            assert.equal(res.status, 400);
            assert.equal(res.response.body.error, 'Not Authorized as Admin');
            done();
          });
      })
      .catch(done);
  });
});

