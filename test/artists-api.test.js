/* eslint-disable */

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = require('chai').assert;
const app = require('../lib/app');
const connection = require('../lib/mongoose');

describe('artists api', () => {
    before(done => {
        const CONNECTED = 1;
        if(connection.readyState === CONNECTED) dropCollecton();
        else connection.on('open', dropCollection);

        function dropCollection() {
            const collName = 'artists';
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

    const testArtist = {
        name: 'salvador dalí',
        birthdate: 'may 11',
    };

    it('GETs all artists', done => {
        request 
            .get('/api/artists')
            .set('Authorization', `Bearer ${ token }`)
            .then(res => {
                assert.deepEqual(res.body, []);
                done();
            })
            .catch(done);
    });

    it('GETs an artist by id', done => {
        request
            .get(`/api/artists/${ testArtist._id }`)
            .set('Authorization', `Bearer ${ token }`)
            .then(res => {
                assert.deepEqual(res.body, testArtist);
                done();
            })
            .catch(done);
    });

    it('POSTs a new artist', done => { 
        request
            .post('/api/artists')
            .set('Authorization', `Bearer ${ token }`)
            .send(testArtist)
            .then(res => {
                const artist = res.body;
                assert.ok(artist._id);
                testArtist.__v = 0;
                testArtist._id = artist._id;
                done();
            })
            .catch(done);
    });

    it('GETs all artists after POST', done => {
        request
            .get('/api/artists')
            .set('Authorization', `Bearer ${ token }`)
            .then(res => {
                assert.equal(res.body, [ testArtist ]);
                done();
            })
            .catch(done);
    });

    it('updates an artist with PUT request', done => {
        request
            .put(`/api/artists/${ testArtist._id }`)
            .set('Authorization', `Bearer ${ token }`)
            .send({ name: 'Salvador Dalí' })
            .then(res => {
                assert.deepEqual(res.body.name, 'Salvador Dalí');
                done();
            })
            .catch(done);
    });

    it('removes an artist for DELETE request', done => {
        request
            .delete(`/api/artists/${ testArtist._id }`)
            .then(res => {
                assert.isOk(res.body, 'deleted');
                done();
            })
            .catch(done);
    });
});
