const tokenSvc = require('./token');

module.exports = function getCheckAuth() {

	return function CheckAuth(req, res, next) {
		// look for token in the authorization header 
		// (express lowercases all the headers)
		const authHeader = req.headers.authorization;

		// didn't provide a token, error
		if(!authHeader) {
			return next({
				code: 400,
				error: 'unauthorized, no token provided'
			});
		}
		const jwt = authHeader;
		if(!jwt) {
			return next({
				code: 400,
				error: 'unauthorized, missing token'
			});
		}

		// verify the _actual_ jwt token
		tokenSvc.verify(jwt)
			.then(payload => {
				req.user = payload;
				next();
			})
			.catch(err => {
				return next({
					code: 403,
					error: 'unauthorized, invalid token', err
				});
			});
	};

};