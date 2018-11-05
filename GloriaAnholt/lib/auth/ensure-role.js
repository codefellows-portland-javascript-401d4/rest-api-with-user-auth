/** Created by Gloria Anholt on 11/9/16. **/


module.exports = function getEnsureRole() {

  return function ensureRole(req, res, next) {

    if (req.user.roles.indexOf('admin') === -1) {
      return next({
        code: 401,
        error: 'Unauthorized.'
      });
    }
    next();

  };
};