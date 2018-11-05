const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');
const app = require('../lib/app');

describe('teams api', () => {
  before(done => {
    const drop = () => connection.db.dropDatabase(done);
    if(connection.readyState === 1) drop();
    else connection.on('open', drop);
  });

  const request =  chai.request(app);
  const navi = {"teamName":"Natus Vincere","teamMembers":["Ditya Ra","Dendi","GeneRaL","SoNNeikO","Artstyle"],"tiWinner":true};

  let token = '';

  before(done => {
    request
      .post('/auth/signup')
      .send({username: 'testuser2', password: 'test', roles:['admin']})
      .then(res => assert.ok(token = res.body.token))
      .then(done, done);
  })

  it('should save a file from a POST request', done => {
    request
      .post('/teams')
      .set('token', token)
      .send(navi)
      .then(res => {
        assert.ok(res.body._id);
        navi._id = res.body._id;
        navi.__v = 0;
        done()
      })
      .catch(done);
  });

  it('should get all teams from a GET request', done => {
    request
      .get('/teams')
      .set('token', token)
      .then(res => {
        assert.deepEqual(res.body, [navi]);
        done();
      })
      .catch(done);
  });

  it('should get a team by id', done => {
    request
      .get(`/teams/${navi._id}`)
      .set('token', token)
      .then(res => {
        assert.deepEqual(res.body, navi)
        done();
      })
      .catch(done);
  });

  it('should get a team by team name', done => {
    request
      .get('/teams')
      .set('token', token)
      .query({teamName: 'Natus Vincere'})
      .then(res => {
        assert.deepEqual(res.body, [navi]);
        done();
      })
      .catch(done);
  });

  it('should update a file', done => {
    request
      .put(`/teams/${navi._id}`)
      .set('token', token)
      .send({teamName: 'Navi'})
      .then(res => {
        assert.deepEqual(res.body, {ok: 1, nModified: 1, n: 1});
        done();
      })
      .catch(done);
  });
  it('should delete a file', done => {
    request
      .del(`/teams/${navi._id}`)
      .set('token', token)
      .then(res => {
        assert.equal(res.text, `Resource ${navi._id} was deleted`);
        done();
      })
      .catch(done);
  });
});