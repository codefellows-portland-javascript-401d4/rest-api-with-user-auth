/* eslint-disable */

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = require('chai').assert;
const app = require('../lib/app');
const connection = require('../lib/mongoose');

describe('movements api', () => {
    before(done => {
        const CONNECTED = 1;
        if(connection.readyState === CONNECTED) dropCollecton();
        else connection.on('open', dropCollection);

        function dropCollection() {
            const collName = 'movements';
            connection.db
                .listCollections({ collName })
                .next((err, collinfo) => {
                    if (!collinfo) return done();
                    connection.db.dropCollecton(collName, done);
                });
        }
    });

    const request = chai.request(app);
    let token = '';

    before(done => {
        request
            .post('/api/auth/signup')
            .send({ username: 'test', password: 'abc' })
            .then(res => {
                assert.ok(token = res.body.token);
            })
            .then(done, done);
    });

    const testMovement = {
        name: 'surrealism',
        start: 1924,
        end: 1966
    };

    it('GETs all movements', done => {
        request 
            .get('/api/movements')
            .set('Authorization', `Bearer ${ token }`)
            .then(res => {
                assert.deepEqual(res.body, []);
                done();
            })
            .catch(done);
    });

    it('GETs a movement by id', done => {
        request
            .get(`/api/movements/${ testMovement._id }`)
            .set('Authorization', `Bearer ${ token }`)
            .then(res => {
                assert.deepEqual(res.body, testMovement);
                done();
            })
            .catch(done);
    });

    it('POSTs a new movement', done => { 
        request
            .post('/api/movements')
            .set('Authorization', `Bearer ${ token }`)
            .send(testMovement)
            .then(res => {
                const movement = res.body;
                assert.ok(movement._id);
                testMovement.__v = 0;
                testMovement._id = movement._id;
                done();
            })
            .catch(done);
    });

    it('GETs all movements after POST', done => {
        request
            .get('/api/movements')
            .set('Authorization', `Bearer ${ token }`)
            .then(res => {
                assert.equal(res.body, [ testMovement ]);
                done();
            })
            .catch(done);
    });

    it('updates a movement with PUT request', done => {
        request
            .put(`/api/movements/${ testMovement._id }`)
            .set('Authorization', `Bearer ${ token }`)
            .send({ name: 'Surrealism' })
            .then(res => {
                assert.deepEqual(res.body.name, 'Surrealism');
                done();
            })
            .catch(done);
    });

    it('removes a movement for DELETE request', done => {
        request
            .delete(`/api/movements/${ testMovement._id }`)
            .then(res => {
                assert.isOk(res.body, 'deleted');
                done();
            })
            .catch(done);
    });
});
