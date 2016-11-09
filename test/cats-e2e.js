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
      const name = 'cats';
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
    username: 'catlover777',
    password: '123'
  };
  const murray = {
    name: 'Murray',
    age: 2,
    chill: true
  };

  const oscar = {
    name: 'Oscar',
    age: 20,
  };


  let token = '';

  it('Will not permit a request without token', done => {
    request
      .get('/cats')
      .then(res => {
        done('we should have thrown and error', res);
      })
      .catch(res => {
        assert.equal(res.response.res.text, '400 ERROR: Token required!');
        done();
      });
  });

  it('Generates a token when a user logs in', done => {
    request
      .post('/auth/signup')
      .send(testUser)
      .then(res => {
        assert.isOk(res.body.token);
        token = res.body.token;
        done();
      })
      .catch(done);
  });

  it('allows user to post resource with token', done => {
    request
      .post('/cats')
      .send(murray)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .then(res => {
        assert.isOk(res.body);
        murray._id = res.body._id;
        done();
      })
      .catch(done);
  });

  it('sets defualt "chill" value of resource to false', done => {
    request
      .post('/cats')
      .send(oscar)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .then(res => {
        assert.deepEqual(res.body.chill, false);
        oscar._id = res.body._id;
        done();
      })
      .catch(done);
  });

  it('retrieves resource by id', done => {
    request
      .get(`/cats/${murray._id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .then(res => {
        assert.deepEqual(murray, res.body);
        done();
      })
      .catch(done);
  });

  it('retrieves all resources', done => {
    request
      .get('/cats')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.body.length, 2);
        done();
      })
      .catch(done);
  });

  it('updates a resource', done => {
    request
      .put(`/cats/${oscar._id}`)
      .send({name: oscar.name, age: 21, chill: true})
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.body.age, 21);
        done();
      })
      .catch(done);
  });

  it('informs client of delete', done => {
    request
      .delete(`/cats/${oscar._id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .then(res => {
        assert.equal(res.text, 'You have deleted a resource');
        done();
      })
      .catch(done);
  });

  it('deleted resource no longer in DB', done => {
    request
      .get('/cats')
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .then(res => {
        assert.deepEqual(res.body, [murray]);
        done();
      })
      .catch(done);
  });
});
