const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require( '../lib/setup-mongoose');

const app = require( '../lib/app' );

describe( 'coach', () => {
    before( done => {
        const CONNECTED = 1;
        if (connection.readyState === CONNECTED) dropCollection();
        else connection.on('open', dropCollection);

        function dropCollection() {
            const name = 'coaches';
            connection.db
                .listCollections({ name })
                .next((err, collinfo) => {
                    if (!collinfo) return done();
                    connection.db.dropCollection(name, done);
                });
        }
    });

    const request = chai.request(app);
    let token = '';

    before(done => {
        request
        .post('api/auth/signup')
        .send({ username: 'bill', password: 'pizza'})
        .then(res => assert.ok(token = res.body.token))
        .then(done, done);
    });

    let pete = {
        coachName: 'Pete Carroll'
    };

    it( 'GET all', done => {
        request
            .get( '/api/coaches' )
            .set('Authorization', `Bearer ${token}`)
            .then( res => {
                assert.deepEqual( res.body, []);
                done();
            })
            .catch( done );
    });

    it( 'POST', done => {
        request
            .post( '/api/coaches' )
            .set('Authorization', `Bearer ${token}`)
            .send( pete )
            .then( res => {
                const coach = res.body;
                assert.ok( coach._id);
                // pete.__v = 0;
                // pete._id = coach._id;
                pete = coach;
                done();
            })
            .catch( done );
    });

    it( 'GET by id', done => {
        request
            .get(`/api/coaches/${pete._id}` )
            .set('Authorization', `Bearer ${token}`)
            .then( res => {
                const coach = res.body;
                assert.deepEqual( coach, pete );
                done();
            })
            .catch( done );
    });

    it('GET all after POST', done => {
        request
            .get('/api/coaches/')
            .set('Authorization', `Bearer ${token}`)
            .then(res => {
                assert.equal(res.body.length, 1);
                assert.equal(res.body[0]._id, pete._id);
                done();
            })
            .catch(done);
    });
});