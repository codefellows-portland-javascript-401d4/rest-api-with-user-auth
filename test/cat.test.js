const Cat = require('../lib/models/cat');
const assert = require('chai').assert;

describe('cat model', () => {
  const cat = new Cat({
    name: 'test cat',
    age: 4
  });

  it('Validates cat with correct schema', done => {
    cat.validate(err => {
      if(!err) done();
      else done(err);
    });
  });

  it('sets "chill" to false by default', done => {
    assert.equal(cat.chill, false);
    done();
  });

  it('requires cat to have a name', done => {
    const badCat = new Cat ({
      age: 5
    });
    badCat.validate(err => {
      assert.isOk(err);
      done();
    });
  });

  it('requires age to be a number', done => {
    const badCat = new Cat ({
      name: 'bad cat',
      age: 'five'
    });
    badCat.validate(err => {
      assert.isOk(err);
      done();
    });
  });
});
