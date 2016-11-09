const errorHandler = require('../lib/error-handler');
const assert = require('chai').assert;

describe('errorHandler function', () => {
  const err = {};
  const req = {};
  const res = {};
  const next = {};

  res.send = function(obj) {
    this.message = obj.message;
  };

  res.status =  function(obj) {
    this.code = obj.code;
    return this;
  };

  it('handles a generic error', done => {
    errorHandler(err, req, res, next);
    assert.equal(err.message, 'Internal server Error!');
    assert.equal(err.code, 500);
    done();
  });

  it('handles a ValidationError', done => {
    err.name = 'ValidationError';
    errorHandler(err, req, res, next);
    assert.equal(err.message, 'Invalid data input!');
    assert.equal(err.code, 400);
    done();
  });

  it('handles SyntaxError', done => {
    err.name = 'SyntaxError';
    errorHandler(err, req, res, next);
    assert.equal(err.message, 'Invalid data input!');
    assert.equal(err.code, 400);
    done();
  });

  it('handles CastError', done => {
    err.name = 'CastError';
    errorHandler(err, req, res, next);
    assert.equal(err.message, 'Bad request, resource does not exist!');
    assert.equal(err.code, 404);
    done();
  });
});
