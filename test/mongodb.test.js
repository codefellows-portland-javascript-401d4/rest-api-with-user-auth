const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const connection = require('../lib/mongoose-setup');
const app = require('../lib/app');

describe('tests the mongo database', () => {

    const request = chai.request(app);
    const timberJim = {
        "name": "Timber Jim",
        "age": 50,
        "jerseyNumber": 8
    };
    const timber = {
        teamName: 'Timbers',
        city: 'Portland',
        players: [null]
    };

    let _id = '';

    // it('Makes a GET request and asserts the database is empty', done => {

    //     request
    //         .get('/team')
    //         .then(res => {
    //             assert.notDeepEqual(res.body, []);
    //             done();
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             done(err);
    //         });
    // });

    it('Posts a team into the db', done => {
            console.log("test" + timbers);
        request
            .post('/team/1')
            .send(timber)
            .then(res => {
                assert.ok(res.body._id);
                timber._id = res.body._id;
                timber.__v = 0;
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            });
    });

    it('Posts a new player into the db', done => {
        request
            .post('/person/1')
             .send(timberJim)
             .then(res => {
                timberJim._id = res.body._id;
                timberJim.__v = 0;
                assert.deepEqual(res.body, timberJim);
             })
             .catch(err => {
                 console.log(err);
                 done(err);
             });
    });
    // it('Deletes a team from the db', done => {
    //     request
    //         .del('/api/team'+ timber._id)
    //         .then(res => {
    //             assert.deepEqual(res.body, timbers);
    //             done();
    //         })
    //         .catch(err =>{
    //             console.log(err);
    //             done(err);
    //         });
    // });

});