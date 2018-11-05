const tokenSvc = require('./token');

module.exports = function getEnsureAuth() {
    return function ensureAuth(req, res, next) {
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return next({
                code: 400,
                error: 'unauthorized, no token provided'
            });
        }

        /*
        const [bearer, jwt] = authHeader.split(' ');
        
        is the same as
        
        const splitArr = authHeader.split(' ');
        const bearer = splitArr[0];
        const jwt = splitArr[1];
         */
        const [bearer, jwt] = authHeader.split(' ');

        if (bearer !== 'Bearer' || !jwt) {
            return next({
                code: 400,
                error: 'unauthorized, invalid token'
            });
        }

        tokenSvc.verify(jwt)
            .then(payload => {
                req.user = payload;
                next();
            })
            //eslint-disable-next-line no-unused-vars
            .catch(err => {
                return next({
                    code: 403,
                    error: 'unauthorized, invalid token'
                });
            });
    };
};