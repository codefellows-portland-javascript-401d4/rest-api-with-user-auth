// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const assert = chai.assert;
// chai.use(chaiHttp);
// const connection = require('../lib/setup-mongoose');
// const app = require('../lib/app');
// const request = chai.request(app);

// describe('RESTful API for ships resource', () => {

//   let token = '';

//   before(done => {
//     let CONNECTED = 1;
//     if (connection.readyState === CONNECTED) dropCollection();
//     else connection.on('open', dropCollection);

//     function dropCollection() {
//       let name = 'ships';
//       connection.db
//         .listCollections({ name })
//         .next((err, info) => {
//           if (!info) return done();
//           connection.db.dropCollection(name, done);
//         });
//     }

//     request
//       .post('/api/auth/signup')
//       .send({ username: 'testU', password: 'testPW'})
//       .then(({ body }) => assert.ok(token = body.token));

//   });

//   const ship1 = {
//     name: 'Executor',
//     type: 'Super Star Destroyer',
//     lengthMeters: 19000
//   };
//   const ship2 = {
//     name: 'Millenium Falcon',
//     type: 'Smuggling Vessel',
//     lengthMeters: 34.75,
//     __v: 0
//   };

//   it('Starts with empty collection', done => {
//     request
//       .get('/api/ships')
//       .set('authorization', token)
//       .then(res => {
//         assert.deepEqual(res.body, []);
//         done();
//       })
//       .catch(done);
//   });

//   it('Adds a ship to the collection', done => {
//     request
//       .post('/api/ships')
//       .set('authorization', token)
//       .send(ship1)
//       .then(res => {
//         const resShip = res.body;
//         assert.ok(resShip._id);
//         ship1._id = resShip._id;
//         ship1.__v = 0;
//         done();
//       })
//       .catch(done);
//   });

//   it('Gets ship by Id', done => {
//     request
//       .get(`/api/ships/${ship1._id}`)
//       .set('authorization', token)
//       .then(res => {
//         const resShip = res.body;
//         assert.deepEqual(resShip, ship1);
//         done();
//       })
//       .catch(done);
//   });

//   it('Gets all ships', done => {
//     request
//       .get('/api/ships')
//       .set('authorization', token)
//       .then(res => {
//         assert.deepEqual(res.body, [ ship1 ]);
//         done();
//       })
//       .catch(done);
//   });

//   it('Updates a ship with PUT', done => {
//     request
//       .put(`/api/ships/${ship1._id}`)
//       .set('authorization', token)
//       .send(ship2)
//       .then(res => {
//         ship2._id = ship1._id;
//         assert.deepEqual(res.body, ship2);
//         done();
//       })
//       .catch(done);
//   });
  
//   it('Removes a ship with DELETE', done => {
//     request
//       .delete(`/api/ships/${ship1._id}`)
//       .set('authorization', token)
//       .then(() => {
//         request
//           .get('/api/ships')
//           .set('authorization', token)
//           .then(res => {
//             assert.equal(res.body.length, 0);
//             done();
//           })
//           .catch(done);
//       })
//       .catch(done);
//   });

// });

