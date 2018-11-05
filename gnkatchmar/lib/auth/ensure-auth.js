const tokenSvc = require('./token');

module.exports = function getEnsureAuth() {

  return function ensureAuth(req, res, next) {
		// look for token in the authorization header 
		// (express lowercases all the headers; Postman wants to capitalize)
    const authHeader = req.headers.authorization;

    if(!authHeader) {
      return next({
        code: 400,
        error: 'unauthorized, no token provided'
      });
    }

    tokenSvc.verify(authHeader)
			.then(payload => {
  			req.user = payload;
  next();
})
			.catch(err => {
  return next({
    code: 403,
    error: 'unauthorized, invalid token'
  });
});
  };

};