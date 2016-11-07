module.exports = function errorHandler(err, req, res, next) { //eslint-disable-line
  if(!err.message) {
    err.code = 500;
    err.message = 'Internal server Error!';
    if(err.name === 'SyntaxError' || err.name === 'ValidationError') {
      err.code = 400;
      err.message = 'Invalid data input!';
    } else if (err.name === 'CastError') {
      err.code = 404;
      err.message = 'Bad request, resource does not exist!';
    }  
  }
  console.error(err.code, err.message);
  res.status(err.code).send(`${err.code} ERROR: ${err.message}`);
};
