const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');
const app = require('../lib/app');

describe('region api', () => {
  before(done => {
    const drop = () => connection.db.dropDatabase(done);
    if (connection.readyState === 1) drop();
    else connection.on('open', drop);

  });

  const request = chai.request(app);
  const NA = {"region": "NA", "teams": ["Evil Geniuses", "FDL", "CompLexity"]};

  let token = '';

  before(done => {
    request
      .post('/auth/signup')
      .send({username: 'testuser', password: 'testpword', roles: ['admin']})
      .then(res => assert.ok(token = res.body.token))
      .then(done, done);
  });
  
  it('should save a file from a POST request', done => {
    request
    .post('/regions')
    .set('token', token)
    .send(NA)
    .then(res => {
      assert.ok(res.body._id);
      NA._id = res.body._id;
      NA.__v = 0;
      done();
    })
    .catch(done);
  });

  it('should get all files from a GET request', done => {
    request
      .get('/regions')
      .set('token', token)
      .then(res => {
        assert.deepEqual(res.body, [NA]);
        done();
      })
      .catch(done);
  });

  it('should get a file by query string', done =>{
    request
      .get('/regions')
      .set('token', token)
      .query({region: 'NA'})
      .then(res => {
        assert.deepEqual(res.body, [NA]);
        done();
      })
      .catch(done);
  });

  it('should update a file', done => {
    request
      .put(`/regions/${NA._id}`)
      .set('token', token)
      .send({teams: ['Veggies', 'Evil Geniuses', 'Void Boys']})
      .then(res => {
        assert.deepEqual(res.body, { ok: 1, nModified: 1, n: 1 });
        done();
      })
      .catch(done);
  });
  it('should show the number of ti winning teams in the region', done => {
    request
      .get('/winners/NA')
      .set('token', token)
      .then(res => {
        assert.equal(res.text, 'This region has 1 TI winning teams');
        done();
      })
      .catch(done);
  });

  it('should delete a file', done => {
    request
      .del(`/regions/${NA._id}`)
      .set('token', token)
      .then(res => {
        assert.equal(res.text, `Resource ${NA._id} was deleted`);
        done();
      })
      .catch(done);
  });
});

