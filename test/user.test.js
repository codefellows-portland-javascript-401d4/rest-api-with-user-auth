const User = require('../lib/models/user');
const assert = require('chai').assert;

describe('user model', () => {
  const user = new User({
    username: 'test',
    password: '123'
  });

  it('validates user with proper schema', done => {
    user.validate(err => {
      if(!err) done();
      else done(err);
    });
  });

  it('sets "permissions" to [\'user\'] by default', done => {
    assert.deepEqual(user.permissions[0], 'user');
    done();
  });

  it('requires username', done => {
    const badUser = new User({
      password: '123'
    });
    badUser.validate(err => {
      assert.isOk(err);
      done();
    });
  });

  it('requires password', done => {
    const badUser = new User({
      username: 'test'
    });
    badUser.validate(err => {
      assert.isOk(err);
      done();
    });
  });

  it('hash is not the original password', done => {
    assert.notEqual(user.password, user.generateHash(user.password));
    done();
  });

  it('hash compares correctly to original password', done => {
    assert.isOk(user.compareHash('123'));
    done();
  });
});
