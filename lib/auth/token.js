const jwt = require('jsonwebtoken');

const secretToken = process.env.APP_TOKEN || 'catzrule666';

module.exports = {
  sign(user) {
    return new Promise((resolve, reject) => {
      const payload = {
        id: user._id,
        permissions: user.permissions
      };

      jwt.sign(payload, secretToken, null, (err, token) => {
        if(err) return reject(err);
        resolve(token);
      });
    });
  },
  verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretToken, (err, payload) => {
        if(err) return reject(err);
        resolve(payload);
      });
    });
  }
};
