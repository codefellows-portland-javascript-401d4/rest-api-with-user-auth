/** Created by Gloria Anholt on 11/7/16. **/

const tokenChecker = require('./token');

module.exports = function getEnsureAuth() {

  return function ensureAuth(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next({
        code: 400,
        error: 'Unauthorized: No token provided.'
      });
    }

    tokenChecker.validate(authHeader)
      .then(payload => {
        req.user = payload;
        next();
      })
      .catch(err => {
        return next({
          code: 403,
          error: 'Unauthorized: Invalid token.', err
        });
      });

  };

};

