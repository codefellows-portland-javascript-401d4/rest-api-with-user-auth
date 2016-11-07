const chai = require( 'chai' );
const chaiHttp = require( 'chai-http' );
const assert = chai.assert;
chai.use( chaiHttp );

const connection = require( '../lib/setupMongooseTest' );
const app = require( '../lib/app.js' );

describe( 'tree', () => {

	before( done => {
		const CONNECTED = 1;
		if (connection.readyState === CONNECTED) dropCollection();
		else connection.on('open', dropCollection);

		function dropCollection(){
			const name = 'trees';
			connection.db
                .listCollections({ name })
                .next( (err, collinfo) => {
	if (!collinfo) return done();
	connection.db.dropCollection(name, done);
});
		}
	});

	const request = chai.request( app );

	const douglasFir = {
		name: 'Douglas Fir',
		type: 'gymnosperm', 
		genus: 'Pseudotsuga', 
		percentage: 90
	};

	const maple = {
		name: 'Bigleaf Maple',
		type: 'angiosperm', 
		genus: 'Acer', 
		percentage: 50
	};

	it( 'does not contain trees until they are aded', done => {
		request
			.get( '/api/trees' )
			.then( res => {
				assert.deepEqual( res.body, [] );
				done();
			})
			.catch( done );
	});

	it( 'adds trees', done => {
		request
			.post( '/api/trees' )
			.send(douglasFir)
			.then( res => {
				const tree = res.body;
				assert.ok( tree._id );
				douglasFir.__v = 0;
				douglasFir._id = tree._id;
				done();
			})
			.catch( done );

	});

	it( '/GETs trees by genus', done => {
		request
			.get( '/api/trees/genus/Pseudotsuga' )
			.then( res => {
				assert.deepEqual( res.body, [douglasFir] );
				done();
			})
			.catch( done );
	});

	it( '/GETs all trees after one post', done => {
		request
			.get( '/api/trees' )
			.then( res => {
				assert.deepEqual( res.body, [ douglasFir ] );
				done();
			})
			.catch( done );
	});

	it( 'adds an angiosperm', done => {
		request
			.post( '/api/trees' )
			.send(maple)
			.then( res => {
				assert.ok( res.body._id );
				maple.__v = 0;
				maple._id = res.body._id;
				done();
			})
			.catch( done );
	});

	it( '/GET where type is angiosperm', done => {
		request
            .get('/api/trees/angiosperms')
            .then(res => {
	assert.deepEqual(res.body, [maple]);
	done();
})
			.catch( done );	
	});

	it( '/GETs trees by ID', done => {
		request
			.get( '/api/trees/'+ maple._id)
			.then( res => {
				assert.deepEqual( res.body, [maple] );
				done();
			})
			.catch( done );
	});

	after( done=> {
		connection.close(done);
	});
});
