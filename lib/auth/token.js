
const jwt = require('jsonwebtoken');

const tokenCode = process.env.APP_SECRET;

module.exports = {
    sign(user) {
        return new Promise((resolve, reject) => {
            const payload = {
                id: user._id,
                roles: user.roles
            };

            jwt.sign(payload, tokenCode, null, (err, token) => {
                if (err) return reject(err);
                resolve(token);
            });
        });
    },
    verify(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, tokenCode, (err, payload) => {
                if (err) return reject(err);
                resolve(payload);
            });
        });
    }
};
