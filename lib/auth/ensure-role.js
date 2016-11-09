/** Created by Gloria Anholt on 11/9/16. **/

const User = require('../models/users');

module.exports = function getEnsureRole() {

  return function ensureRole(req, res, next) {

    const username = req.body.username;

    User.findOne({ username })
      .select('roles')
      .then(user => {
        if (user.roles.indexOf('admin') === -1) {
          return next({
            code: 401,
            error: 'Unauthorized.'
          });
        }
        next();
      });
  };
};