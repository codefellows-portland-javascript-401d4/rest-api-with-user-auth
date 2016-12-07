'use strict';

const request = require('../request');
const assert = require('chai').assert;

describe('movements api', () => {

    let token = '';

    before(() => 
        request
            .post('/auth/signup')
            .send({ username: 'testuser', password: 'abc' })
            .then(({ body }) => assert.ok(token = body.token))
    );

    let testMovement = {
        name: 'surrealism',
        start: 1924,
        end: 1966
    };

    it('/GETs all movements', () => 
        request 
            .get('/movements')
            .set('Authorization', `Bearer ${token}`)
            .then(({ body }) => assert.deepEqual(body, []))
    );

    it('/POSTs a new movement', () => 
        request
            .post('/movements')
            .set('Authorization', `Bearer ${token}`)
            .send(testMovement)
            .then(({ body }) => {
                assert.ok(body._id);
                testMovement = body;
            })
    );

    it('/GETs an movement by id', () => 
        request
            .get(`/movements/${testMovement._id}`)
            .set('Authorization', `Bearer ${token}`)
            .then(({ body }) => assert.deepEqual(body, testMovement))
    );

    it('/GETs all movements after new post', () => 
        request
            .get('/movements')
            .set('Authorization', `Bearer ${token}`)
            .then(res => {
                assert.equal(res.body.length, 1);
                assert.equal(res.body[0]._id, testMovement._id);
            })
    );

    // it('updates an artist for /PUT request', done => {
    //     request
    //         .put(`/artists/${testArtist._id}`)
    //         .send(testArtist.name)
    //         .then(response => {
    //             const update = response.body.name
    //             assert.deepEqual(update, testArtist.name);
    //             done();
    //         })
    //         .catch(done);
    // });

    // it('removes an artist for /DELETE request', done => {
    //     request 
    //         .delete(`/artists/${testArtist._id}`)
    //         .then(response => {
    //             assert.isOk(response.body, 'deleted');
    //             done();
    //         })
    //         .catch(done);
    // });
});
