const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../lib/app');
const connection = require('../lib/mongooseSetup');
chai.use(chaiHttp);
mongoose.Promise = Promise;

describe('Checking access to anime DB with user authentication', () => {
    before( done => {
        const CONNECTED = 1;
        if (connection.readyState === CONNECTED) dropCollection();
        else connection.on('open', dropCollection);

        function dropCollection() {
            const animeshow = 'animeshow';
            const animechar = 'animechar';
            connection.db
                .listCollections({name: [animeshow, animechar]})
                .next((err, callinfo) => {
                    if (!callinfo) return done();
                    connection.db.dropCollection([animeshow, animechar], done);
                });
        };
    });

    const request = chai.request(app);

    describe('checking access rights', () => {
        it('400 with no token', done => {
            request
                .get('/animechars')
                .then(res => {
                    done('status should not be 200');
                })
                .catch(res => {
                    assert.equal(res.status, 400);
                    assert.equal(res.response.body.error, 'unauthorized, no token provided');
                    done();
                })
                .catch(done);
        });

        it('403 with a bad token', done => {
            request
                .get('/animechars')
                .set('Authorization', 'Bearer hahaha')
                .then( res => {
                    done('status should not be 200');
                })
                .catch(res => {
                    assert.equal(res.status, 403);
                    assert.equal(res.response.body.error, 'unauthorized, invalid token');
                    done();
                })
                .catch(done);
        });
    });

    const newUser = {
        username: 'Shinji Ikari',
        password: 'Evangelion'
    };
    const token = {};

    describe('user access rights', done => {

    });


    function badRequest(url, send, error, done) {
        request
            .post(url)
            .send(send)
            .then(res => {
                done('status should not be 200');
            })
            .catch(res => {
                assert.equal(res.status, 400);
                assert.equal(res.response.body.error, error);
                done();
            })
            .catch(done);
    };

    it('signup requires a valid username', done => {
        badRequest('/users/signup', {password: 'whatever'}, 'username and password must be given', done);
    });

    // it('Calls /POST for user signup', done => {
    //     request
    //         .post('/users/signup')
    //         .send(newUser)
    //         .then(user => {
    //             assert.isOk(user.body);
    //             token.token = user.body.token;
    //             done();
    //         })
    //         .catch(err => {
    //             done(err);
    //         })
    // });

    
});