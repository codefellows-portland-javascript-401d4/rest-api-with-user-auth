const token = require('./token');

module.exports = function getEnsureAuth() {

  return function ensureAuth(req, res, next) {
    const jwt = req.headers.authorization;
    if(!jwt) {
      return next({
        code: 400,
        error: 'Unauthorized, no token provided'
      });
    }
    token.verify(jwt)
      .then(payload => {
        req.user = payload;
        next();
      })
      .catch(err => {
        return next({
          code: 403,
          error: 'Unauthorized, invalid token'
        });
      });
  };
  
};
