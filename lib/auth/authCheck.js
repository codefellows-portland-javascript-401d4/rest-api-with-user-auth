const jwsToken = require('./authorized');

module.exports = function authCheck() {
    return function getAuth() {
        let authHeader = req.headers.authorization;
        if (!authHeader) {return next({code: 403, error: 'Auth header missing'});}
        const [bearer, jwt] = authHeader.split(' '); // Need to remove the Bearer 
        if (bearer !== 'Bearer' || !jwt) {return next({code: 403, error: 'Token appears top be different'});  // did we get a 'Bearer'
        jwsToken.verify(jwt)
            .then(payload => { 
                req.user = payload;
                next();
            })
            .catch(err => {
                return next({code: 403, error: 'Verify failure'});
            });
    };
};