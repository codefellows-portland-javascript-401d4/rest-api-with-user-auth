
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const server = require('../server.js');
// const assert = chai.assert;
// chai.use(chaiHttp);

// const path = require('path');
// // load test env variables
// require('dotenv').load({ path: path.join(__dirname, '.env.test') });

// const connection = require('../lib/mongoose-config');
// const app = require('../lib/app');

// describe('Validating User Roles', () => {

//     before( done => {
//         const CONNECTED = 1;
//         if (connection.readyState === CONNECTED) dropCollection();
//         else connection.on('open', dropCollection);

//         function dropCollection(){
//             const name = 'roles';
//             connection.db
//                 .listCollections({ name })
//                 .next( (err, collinfo) => {
//                     if (!collinfo) return done();
//                     connection.db.dropCollection(name, done);
//                 });
//         }
//     });

//     const testRole = {
//         name: 'Test Role Admin',
//         code: 100,
//         accessLevel: 'none'
//     };

//     const testRoleUpd = {
//         name: 'admin',
//         accessLevel: 'ALL'
//     };

//     const testRoleFinal = {
//         name: 'admin',
//         code: 100,
//         accessLevel: 'ALL'
//     };

//     const testRole2 = {
//         name: 'temporary Role',
//         code: 400,
//         accessLevel: 'ALL'
//     };

//     const request = chai.request(app);

//     it('GET all ', done => {
//         request
//             .get('/api/roles')
//             .then( res => {
//                 assert.deepEqual(res.body, []);
//                 done();
//             })
//             .catch(done);
//     });

//     it('POST request', done => {
//         request
//             .post('/api/roles')
//             .send(testRole)
//             .then(res => {
//                 const newRole = res.body;
//                 assert.ok(newRole._id);
//                 testRole._id = newRole._id;
//                 testRole.__v = 0;
//                 testRoleFinal._id = newRole._id;
//                 testRoleFinal.__v = 0;
//                 done();
//             })
//             .catch(done);
//     });

//     it('GET all after POST', done => {
//         request
//             .get('/api/roles')
//             .then( res => {
//                 assert.deepEqual(res.body, [testAptBldg]);
//                 done();
//             })
//             .catch(done);
//     });

//     it('PUT request', done => {
//         request
//             .put(`/api/roles/${testAptBldg._id}`)
//             .send(testAptBldgUpd)
//             .then(res => {
//                 assert.deepEqual(res.body, testAptBldg);
//                 done();
//             })
//             .catch(done);
//     });

//     it('GET by id', done => {
//         request
//             .get(`/api/roles/${testAptBldgFinal._id}`)
//             .then( res => {
//                 testAptBldgFinal.apartments = [];
//                 assert.deepEqual(res.body, testAptBldgFinal);
//                 delete testAptBldgFinal.apartments;
//                 done();
//             })
//             .catch(done);
//     });

//     it('Vacancies request', done => {
//         request
//             .post('/api/roles')
//             .send(testAptBldg2)
//             .then(res => {
//                 const aptBldg = res.body;
//                 assert.ok(aptBldg._id);
//                 testAptBldg2._id = aptBldg._id;
//                 testAptBldg2.__v = 0;
//             })
//             .catch(done);

//         request
//             .get('/api/aptbldgs/vacancies')
//             .then( res => {
//                 assert.deepEqual(res.body, {'Total Vacant Apartments': 5});
//                 done();
//             })
//             .catch(done);
            
//     });

//     it('DELETE request', done => {
//         request
//             .delete(`/api/aptbldgs/${testAptBldg._id}`)
//             .then(res => {
//                 assert.deepEqual(res.body, testAptBldgFinal);
//                 done();
//             })
//             .catch(done);
//     });

// });

