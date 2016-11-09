module.exports = function getEnsureAdmin() {
    

  return function ensureAdmin(req, res, next) {
    const isAdmin = req.user.admin;
    if (isAdmin){
      next();
    }
    else {
      next({
        code: 400,
        error: 'Not Authorized as Admin'
      });
    }
  };
};
