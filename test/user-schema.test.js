/** Created by Gloria Anholt on 11/7/16. **/


const assert = require('chai').assert;
const User = require('../lib/models/users');


describe('User schema', () => {

  it('requires a username', done => {

    let user1 = new User({
      hashpass: 'passw0rd',
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
      hashpass: 'passw0rd'
    });

    user3.validate(err => {
      if (err) done(err);
      else done();
    });

  });

  it('accepts roles', done => {

    done();
  });


});
