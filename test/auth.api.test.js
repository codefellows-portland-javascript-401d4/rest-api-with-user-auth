const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');

const app = require('../lib/app');

describe('Auth: ', () => {

  before( done => {
    const drop = () => connection.db.dropDatabase( done );
    if ( connection.readyState === 1 ) drop();
    else connection.on( 'open', drop );
  });

  const request = chai.request(app);

  describe('Unauthorized: ', () => {

    it('Sends 400 when no token is given', done => {
      request
        .get('/api/artists')
        .then(res => done('This should fail, not be 200'))
        .catch(res => {
          assert.equal(res.status, 400);
          assert.equal(res.response.body.error, 'Unauthorized, no token provided');
          done();
        })
        .catch(done);
    });

    it('Sends 403 when invalid token is given', done => {
      request
        .get('/api/artists')
        .set('authorization', 'invalid token')
        .then(res => done('This should fail, not be 200'))
        .catch(res => {
          assert.equal(res.status, 403);
          assert.equal(res.response.body.error, 'Unauthorized, invalid token');
          done();
        })
        .catch(done);
    });

  });

  const user = {
    username: 'somebody',
    password: 'password'
  };

  describe('User Management: ', () => {

    it('Sends 400 when no username is given', done => {
      request
        .post('/api/auth/signup')
        .send({password: 'password'})
        .then(res => done('This should fail, not be 200'))
        .catch(res => {
          assert.equal(res.status, 400);
          assert.equal(res.response.body.error, 'Username and password must be given');
          done();
        })
        .catch(done);
    });

    it('Sends 400 when no password is given', done => {
      request
        .post('/api/auth/signup')
        .send({username: 'somebody'})
        .then(res => done('This should fail, not be 200'))
        .catch(res => {
          assert.equal(res.status, 400);
          assert.equal(res.response.body.error, 'Username and password must be given');
          done();
        })
        .catch(done);
    });

    let token = '';

    it('Gives the user a token when they sign up', done => {
      request
        .post('/api/auth/signup')
        .send(user)
        .then(res => {
          assert.ok(res.body.token);
          token = res.body.token;
          done();
        })
        .catch(done);
    });

    it('Prevents the use of the same username', done => {
      request
        .post('/api/auth/signup')
        .send(user)
        .then(res => done('This should fail, not be 200'))
        .catch(res => {
          assert.equal(res.status, 400);
          assert.equal(res.response.body.error, 'Username somebody already exists');
          done();
        })
        .catch(done);
    });

    it('Requires a valid token', done => {
      request
        .get('/api/artists')
        .set('authorization', token)
        .then(res => {
          assert.ok(res.body);
          done();
        })
        .catch(done);
    });

    it('Signs in existing user, token is unchanged', done => {
      request
        .post('/api/auth/signin')
        .send(user)
        .then(res => {
          assert.equal(res.body.token, token);
          done();
        })
        .catch(done);
    });
    
  });

}); 
