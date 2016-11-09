const jwt = require('jsonwebtoken');
const appWeight = process.env.APP_WEIGHT || 'app-weight';

const tokenMethods = {
    sign(user) {
        return new Promise((resolve, reject) => {
            const payload = {
                id: user._id,
                roles: user.roles
            };

            //the third argument has a few options you may want to check out
            jwt.sign(payload, appWeight, null, (err, token) => {
                if (err) return reject(err);
                resolve(token);
            });
        });
    },

    verify(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, appWeight, (err, payload) => {
                if (err) return reject(err);
                resolve(payload);
            });
        });
    }
};

module.exports = tokenMethods;