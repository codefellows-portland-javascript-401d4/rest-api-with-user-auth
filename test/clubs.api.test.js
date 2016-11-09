const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');

const app = require('../lib/app');

describe('member', () => {
    before(done => {
        const drop = () => connection.db.dropDatabase(done);
        if (connection.readyState === 1) drop();
        else connection.on('open', drop);
    });

    const request = chai.request(app);
    let token = '';

    before(done => {
        request
            .post('/auth/signup')
            .send({username: 'user', password: 'test'})
            .then(res => {
                assert.ok(token = res.body.token);
                done();
            })
            .catch(done);
    });

    let jay = {
        name: 'Jay',
        gender: 'M'
    };

    it('/get all', done => {
        request
            .get('/members')
            .set('Authorization', token)
            .then(res => {
                assert.deepEqual(res.body, []);
                done();
            })
            .catch(done);
    });

    it('posts', done => {
        request
            .post('/members')
            .set('Authorization', token)
            .send(jay)
            .then(res => {
                const member = res.body;
                assert.isOk(member._id);
                jay = member;
                done();
            })
            .catch(done);
    });

    it('gets by id', done => {
        request
            .get(`/members/${jay._id}`)
            .set('Authorization', token)
            .then(res => {
                const member = res.body;
                assert.deepEqual(member, jay);
                done();
            })
            .catch(done);
    });

    it('gets all after post', done => {
        request
            .get('/members')
            .set('Authorization', token)
            .then(res => {
                assert.equal(res.body.length, 1);
                assert.equal(res.body[0]._id, jay._id);
                done();
            })
            .catch(done);
    });

});