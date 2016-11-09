const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const connection = require('../lib/mongoose-setup');
const app = require('../lib/app');

describe('tests the mongo database', () => {

    const request = chai.request(app);
    const timberJim = {
        name: 'Timber Jim',
        age: 50,
        jerseyNumber: 88
    };
    const timbers = {
        teamName: 'Timbers',
        city: 'Portland',
        players: []
    };

    let _id = '';

    it('Makes a GET request and asserts the database is empty', done => {

        request
            .get('/team')
            .then(res => {
                assert.deepEqual(res.body, []);
                done();
            })
            .catch(err => {
                console.log(err);
                done(err);
            });
    });

    it('Posts a new person into the db', done => {
        request
            .post('/team')
            .send(timbers)
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

    it('Posts a new team into the db', done => {
        request
            .post('/person')
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