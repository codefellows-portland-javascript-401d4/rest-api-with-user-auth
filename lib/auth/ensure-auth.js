const tokenSvc = require('./token');

module.exports = function getEnsureAuth() {

	return function ensureAuth(req, res, next) {
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

		// Authorization header is in form "Bearer token"
		const [bearer, jwt] = authHeader.split(' ');
		
		// check we got right intro word and an jwt
		if(bearer !== 'Bearer' || !jwt) {
			return next({
				code: 400,
				error: 'unauthorized, invalid token'
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
					error: 'unauthorized, invalid token'
				});
			});
	};

};