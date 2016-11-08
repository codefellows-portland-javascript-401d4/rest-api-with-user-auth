const tokenGen = require('./token');

module.exports = function getEnsureAuth() {
    return function ensureAuth(req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next({
                code: 400,
                error: 'unauthorized, no token provided'
            });
        };

        const [bearer, jtoken] = authHeader.split(' ');

        if(bearer !== 'Bearer' || !jtoken) {
            return next({
                code: 400,
                error: 'invalid token you may want to check that Bearer is separated from token with a space'
            });
        };

        tokenGen
            .verify(jtoken)
            .then(payload => {
                // console.log('this is the payload',payload);
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