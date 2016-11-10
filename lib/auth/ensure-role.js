module.exports = function getEnsureRoles(...roles) {

  const lookup = roles.reduce((lookup, role) => {
    lookup[role];
    return lookup;
  }, Object.create(null));

  return function ensureRoles(req, res, next) {
    const userRoles = req.user.roles;

    if(userRoles && userRoles.some(role => lookup[role])){
      next();
    } else {
      next({
        code: 400,
        error: 'Not authorized.'
      });
    }

  };

};