const jwt = require('jsonwebtoken');

const bearerHash = process.env.APP_SECRET || 'test';

const tokenHasher = {
    sign(user) {
        return new Promise((resolve, reject) =>{
            const payload = {
                id: _id,
                groups: user.groups
            };
            jwt.sign(payload, bearerHash, null, (err, token) => {
                if (err) return reject(err);
                resolve(token);
            });
        })
    },
    verify(token){
        return new Promise( (res, reject) => {
            if (err) return reject(err);
        })
    }
}
module.exports = tokenHasher;