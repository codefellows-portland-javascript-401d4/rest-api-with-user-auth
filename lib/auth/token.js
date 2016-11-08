/** Created by Gloria Anholt on 11/7/16. **/

const jwt = require('jsonwebtoken');
const secret = process.env.APP_SECRET || 'app-secret';

module.exports = {

  sign(user) {
    return new Promise((resolve, reject) => {

      const payload = {
        id: user._id,
        roles: user.roles
      };

      jwt.sign(payload, secret, {expiresIn:"2 days"}, (err, token) => {
        if (err) return reject(err);
        resolve(token);
      });
    });
  },

  validate(token) {
    return new Promise((resolve, reject) => {

      jwt.verify(token, secret, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    });
  }
  
};