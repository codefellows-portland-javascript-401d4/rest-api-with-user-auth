//teams-api parallels players-api (for now) so separate testing not needed

const chai = require( 'chai' );
const chaiHttp = require( 'chai-http' );
const assert = chai.assert;
chai.use( chaiHttp );

// start the db, and store connection, 
// so we can clear db
const connection = require( '../lib/setup-mongoose' );

const app = require( '../lib/app' );

describe( 'player api', () => {

//clears database and all of its collections
  before( done => {
    const drop = () => connection.db.dropDatabase( done );
    if ( connection.readyState === 1 ) drop();
    else connection.on( 'open', drop );
  });

  const request = chai.request( app );
  let token = '';

  before(done => {
    request
			.post('/api/auth/register')
			.send({ username: 'testuser', password: 'abc' })
			.then(res => assert.ok(token = res.body.token))
			.then(done, done);
  });

  const healy = {
    name: 'Ryon Healy',
    position: '3B',
    homers: 13
  };

  //he will be used to prove homer leader sort at end
  const bryant =  {
    name: 'Kris Bryant',
    position: '1B',
    homers: 39
  };

  const athletics = {
    team: 'Athletics',
    league: 'American',
    division: 'West',
    wins: 69
  };

//   it( '/POST to register', done => {
//     request
// 			.post( '/api/auth/register' )
//       .send({ username: 'testuser', password: 'abc' })
// 			.then(res => {
//   assert.ok(token = res.body.token);
//   done();
// })
// 			.catch( done );
//   });

  it( '/GET all', done => {
    request
			.get( '/api/players' )
      .set('authorization', `${token}`)
			.then( res => {
  assert.deepEqual( res.body, [] );
  done();
})
			.catch( done );
  });

  it( '/POST', done => {
    request
			.post( '/api/players' )
      .set('authorization', `${token}`)
      .send( healy )
			.then( res => {
  const player = res.body;
  assert.ok( player._id );
  healy._id = player._id;
  done();
})
			.catch( done );

  });

  it( '/GET all after post', done => {
    request
			.get( '/api/players' )
      .set('authorization', `${token}`)
			.then( res => {
  assert.deepEqual( res.body, [ healy ] );
  done();
})
			.catch( done );
  });

  it( '/GET by id', done => {
    request
			.get( `/api/players/${healy._id}` )
      .set('authorization', `${token}`)
			.then( res => {
  const player = res.body;
  assert.deepEqual( player, healy );
  done();
})
			.catch( done );
  });

  it( 'add an additional player', done => {
    request
			.post( '/api/players' )
      .set('authorization', `${token}`)
			.send(bryant)
			.then( res => {
  assert.ok( res.body._id );
  done();
})
			.catch( done );
  });

  it( '/GETs sorted homer leaders after 2nd player (Bryant) with more HRs added earlier', done => {
    request
			.get( '/api/players/hrLeaders' )
      .set('authorization', `${token}`)
			.then( res => {

  assert.equal( res.body[0].name, 'Kris Bryant' );
  done();
})
			.catch( done );
  });

  it( '/POST adding team for next test', done => {
    request
			.post( '/api/teams' )
      .set('authorization', `${token}`)
			.send( athletics )
			.then( res => {
  const team = res.body;
  assert.ok( team._id );
  athletics.__v = 0;
  athletics._id = team._id;
  done();
})
			.catch( done );

  });

  it ('PUTs joins team ID into player data', done => {
    testPath = '/api/teams/' + athletics._id + '/players/' + healy._id;
    request
			.put( testPath )
      .set('authorization', `${token}`)
			.then( res => {
  assert.equal( res.body.teamId, athletics._id); 
  done();
})
			.catch( done );
  });

});



