const tokenService = require('./token');

module.exports = function getCheckAuth() {
  return function checkAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log('auth header', authHeader);
    if(!authHeader) {
      console.log('were in the first handler');
      const err = {
        code: 400,
        message: 'Token required!'
      };
      return next(err);
    }

    tokenService.verify(authHeader)
      .then(payload => {
        console.log('we hit token verification');
        req.user = payload;
        next();
      })
      .catch(() => {
        const err = {
          code: 400,
          message: 'Invalid Token!'
        };
        next(err);
      });
  };
};
