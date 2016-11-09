/** Created by Gloria Anholt on 11/9/16. **/


module.exports = function getEnsureLogin() {

  return function ensureLogin(req, res, next) {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return next({
        code: 400,
        error: 'Username and password are required.'
      });
    }
    next();

  };
};
