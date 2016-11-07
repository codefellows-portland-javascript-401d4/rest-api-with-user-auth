const chai = require( 'chai' );
const chaiHttp = require( 'chai-http' );
const assert = chai.assert;
chai.use( chaiHttp );

const connection = require( '../lib/setupMongooseTest' );
const app = require( '../lib/app.js' );

describe( 'animal', () => {

	before( done => {
		const CONNECTED = 1;
		if (connection.readyState === CONNECTED) dropCollection();
		else connection.on('open', dropCollection);

		function dropCollection(){
			const name = 'animals';
			connection.db
                .listCollections({ name })
                .next( (err, collinfo) => {
	if (!collinfo) return done();
	connection.db.dropCollection(name, done);
});
		}
	});

	const request = chai.request( app );

	const elk = {
		name: 'elk',
		nutrition: 'herbivore', 
		genus: 'Cervus', 
	};

	const brownBear = {
	    name: 'brown bear',
		nutrition: 'omnivore', 
		genus: 'Ursus', 
	};

	it( 'does not contain animals until they are aded', done => {
		request
			.get( '/api/animals' )
			.then( res => {
				assert.deepEqual( res.body, [] );
				done();
			})
			.catch( done );
	});

	it( 'adds animals', done => {
		request
			.post( '/api/animals' )
			.send(elk)
			.then( res => {
				const tree = res.body;
				assert.ok( tree._id );
				elk.__v = 0;
				elk._id = tree._id;
				done();
			})
			.catch( done );

	});

	it( '/GETs animals by genus', done => {
		request
			.get( '/api/animals/genus/Cervus' )
			.then( res => {
				assert.deepEqual( res.body, [elk] );
				done();
			})
			.catch( done );
	});

	it( '/GETs all animals after one post', done => {
		request
			.get( '/api/animals' )
			.then( res => {
				assert.deepEqual( res.body, [ elk ] );
				done();
			})
			.catch( done );
	});

	it( 'adds an omnivore', done => {
		request
			.post( '/api/animals' )
			.send(brownBear)
			.then( res => {
				assert.ok( res.body._id );
				brownBear.__v = 0;
				brownBear._id = res.body._id;
				done();
			})
			.catch( done );
	});

	it( '/GET where type is omnivore', done => {
		request
            .get('/api/animals/omnivores')
            .then(res => {
	assert.deepEqual(res.body, [brownBear]);
	done();
})
			.catch( done );	
	});

	it( '/GETs animals by id', done => {
		request
			.get( '/api/animals/'+brownBear._id)
			.then( res => {
				assert.deepEqual( res.body, [brownBear] );
				done();
			})
			.catch( done );
	});

    // commented out to work as part of the test chain
	// after( done=> {
	// 	connection.close(done);
	// });
});
