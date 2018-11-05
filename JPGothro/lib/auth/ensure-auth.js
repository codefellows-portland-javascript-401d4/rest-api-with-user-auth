const tokenSvc = require('./token');

module.exports = function getEnsureAuth() {

    return function ensureAuth (req, res, next) {

        const authHeaders = req.headers.authorization;

        if (!authHeaders) {
            return next({
                code: 400,
                error: 'unauthorized, no token provided'
            });
        };

        const [bearer, theToken] = authHeaders.split(' ');
        if (bearer !== 'Bearer' || !theToken) {
            return next({
                code: 400,
                error: 'unauthorized, invalid token'
            });
        }

        tokenSvc.verify(theToken)
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
