'use strict';

const request = require('../request');
const assert = require('chai').assert;

describe('artists api', () => {

    let token = '';

    before(() => 
        request
            .post('/auth/signup')
            .send({ username: 'testuser', password: 'abc' })
            .then(({ body }) => assert.ok(token = body.token))
    );

    let testArtist = {
        name: 'salvador dalí',
        birthdate: 'May 11th',
    };

    it('/GETs all artists', () => 
        request 
            .get('/artists')
            .set('Authorization', `Bearer ${token}`)
            .then(({ body }) => assert.deepEqual(body, []))
    );

    it('/POSTs a new artist', () => 
        request
            .post('/artists')
            .set('Authorization', `Bearer ${token}`)
            .send(testArtist)
            .then(({ body }) => {
                assert.ok(body._id);
                testArtist = body;
            })
    );

    it('/GETs an artist by id', () => 
        request
            .get(`/artists/${testArtist._id}`)
            .set('Authorization', `Bearer ${token}`)
            .then(({ body }) => assert.deepEqual(body, testArtist))
    );

    it('/GETs all artists after new post', () => 
        request
            .get('/artists')
            .set('Authorization', `Bearer ${token}`)
            .then(res => {
                assert.equal(res.body.length, 1);
                assert.equal(res.body[0]._id, testArtist._id);
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
