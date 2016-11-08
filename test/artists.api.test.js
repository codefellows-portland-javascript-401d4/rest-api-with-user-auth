const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);
const path = require('path');
require('dotenv').load({ path: path.join(__dirname, '.env.test') });

const connection = require('../lib/setup-mongoose');

const app = require('../lib/app');

describe('Artist:', () => {

  before( done => {
    const drop = () => connection.db.dropDatabase(done);
    if (connection.readyState === 1) drop();
    else connection.on( 'open', drop );
  });

  const request = chai.request(app);
  let token = '';

  before(done => {
    request
      .post('/api/auth/signup')
      .send({ username: 'somebody', password: 'password'})
      .then(res => {
        assert.ok(res.body.token);
        token = res.body.token;
      })
      .then(done)
      .catch(done);
  });

  const quire = {
    name: 'quire',
    type: 'visual',
    genre: 'mixed media',
    shows: 105
  };

  it('GETs all', done => {
    request
      .get('/api/artists')
      .set('authorization', token)
      .then( res => {
        assert.deepEqual(res.body, []);
        done();
      })
      .catch(done);
  });

  it('POSTs a new artist', done => {
    request
      .post('/api/artists')
      .set('authorization', token)
      .send(quire)
      .then(res => {
        const artist = res.body;
        assert.ok(artist._id);
        quire.__v = 0;
        quire._id = artist._id;
        done();
      })
      .catch(done);

  });

  it('GETs by id', done => {
    request
      .get(`/api/artists/${quire._id}`)
      .set('authorization', token)
      .then(res => {
        const artist = res.body;
        assert.deepEqual(artist, quire);
        done();
      })
      .catch(done);
  });

  it('GETs all after post', done => {
    request
      .get('/api/artists')
      .set('authorization', token)
      .then(res => {
        assert.deepEqual(res.body, [quire]);
        done();
      })
      .catch(done);
  });

  it('POSTs default genre of pop', done => {
    request
      .post('/api/artists')
      .set('authorization', token)
      .send({ name: 'tim combs', shows: 92 })
      .then(res => {
        let genre = 'pop';
        assert.ok(res.body._id);
        assert.equal(genre, res.body.genre);
        done();
      })
      .catch(done);
  });

  it('GETs average on artists/averageShow', done => {
    let average = {"average": 98.5};
    request
      .get('/api/artists/averageShows')
      .set('authorization', token)
      .then(res => {
        assert.deepEqual(res.body, average);
        done();
      })
      .catch(done);
  });

  it('GETs where genre is mixed media', done => {
    request
      .get('/api/artists')
      .set('authorization', token)
      .query({genre: 'mixed media'})
      .then(res => {
        assert.deepEqual(res.body, [quire]);
        done();
      })
      .catch(done);
  });

  it('DELETEs an artist', done => {
    request
      .delete(`/api/artists/${quire._id}`)
      .set('authorization', token)
      .then(res => {
        assert.deepEqual(res.body, quire);
        done();
      })
      .catch(done);
  });

});
