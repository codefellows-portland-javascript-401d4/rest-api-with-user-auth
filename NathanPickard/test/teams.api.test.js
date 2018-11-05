const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require( '../lib/setup-mongoose');

const app = require( '../lib/app' );

describe( 'team', () => {
    before( done => {
        const drop = () => connection.db.dropDatabase(done);
        if (connection.readyState === 1) drop();
        else connection.on('open', drop);
    });

        // function dropCollection() {
        //     const name = 'teams';
        //     connection.db
        //         .listCollections({ name })
        //         .next((err, collinfo) => {
        //             if (!collinfo) return done();
        //             connection.db.dropCollection(name, done);
        //         });
        // }
    

    const request = chai.request(app);
    let token = '';

    before( done => {
        request
            .post('/api/auth/signup')
            .send({ username: 'kevin', password: 'bird', roles: ['admin']})
            .then(res => assert.ok(token = res.body.token))
            .then(done, done);
    });

    let seahawks = {
        teamName: 'Seahawks'
    };

    

    it( 'POST', done => {
        request
            .post( '/api/teams' )
            .set('Authorization', `Bearer ${token}`)
            .send( seahawks )
            .then( res => {
                const team = res.body;
                assert.ok( team._id);
                // seahawks.__v = 0;
                // seahawks._id = team._id;
                seahawks = team;
                done();
            })
            .catch( done );
    });

    it( 'GET by id', done => {
        request
            .get(`/api/teams/${seahawks._id}`)
            .set('Authorization', `Bearer ${token}`)
            .then( res => {
                const team = res.body;
                assert.deepEqual( team, seahawks );
                done();
            })
            .catch( done );
    });

    it( 'GET all afer POST', done => {
        request
            .get( '/api/teams' )
            .set('Authorization', `Bearer ${token}`)
            .then( res => {
                assert.equal(res.body.length, 1);
                assert.equal(res.body[0]._id, seahawks._id);
                done();
            })
            .catch( done );
    });
});