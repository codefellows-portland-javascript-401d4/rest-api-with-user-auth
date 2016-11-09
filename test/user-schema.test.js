/** Created by Gloria Anholt on 11/7/16. **/


const assert = require('chai').assert;
const User = require('../lib/models/users');


describe('User schema', () => {

  it('requires a username', done => {

    let user1 = new User({
      password: 'passw0rd',
    });

    user1.validate(err => {
      if (err) {
        console.log('I was expecting an error: ', err.message);
        done();
      } else {
        done('There should have been an error');
      }
    });
  });

  it('requires a password', done => {

    let user2 = new User({
      username: 'ready user two',
    });

    user2.validate(err => {
      if (err) {
        console.log('I was expecting an error: ', err.message);
        done();
      } else {
        done('There should have been an error');
      }
    });
  });

  it('creates a new user when given username and password', done => {

    let user3 = new User({
      username: 'ready user three',
      password: 'passw0rd'
    });

    user3.validate(err => {
      if (err) done(err);
      else done();
    });

  });

  it('accepts roles', done => {

    let user4 = new User({
      username: 'ready user four',
      password: 'passw0rd',
      roles: ['User', 'Admin']
    });

    user4.validate(err => {
      if (err) done(err);
      else done();
    });

  });

  it('hashes a password and gets it back out again', done => {

    let user5 = new User({
      username: 'ready user five',
      password: ''
    });

    // generate the hashed password
    let hashedPass = user5.generateHash('passw0rd');
    // save the hash on the user
    user5.password = hashedPass;
    // check that the original and the hash match
    let results = user5.validateHash( 'passw0rd' );
    // assert that the results are true
    assert.isOk(results, 'should return a truthy value');
    done();

  });


});
