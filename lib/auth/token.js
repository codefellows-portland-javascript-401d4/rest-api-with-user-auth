const jwt = require('jsonwebtoken');

const sekrit = process.env.APP_SECRET || 'app-sekrit';

module.exports = {
  sign(user) {
    return new Promise((resolve, reject) => {

			// this is (jwt optional) data we want stored in token
			// is "transparent", ie can be seen
			// but cannot be modified without ruining token
      const payload = { 
        id: user._id
      };

			// make a token with the payload and use secret
      jwt.sign(payload, sekrit, null, (err, token) => {
        if (err) return reject(err);
        resolve(token);
      });
		
    });
  },

  verify(token){
    return new Promise((resolve, reject) => {
			
      jwt.verify(token, sekrit, (err, payload) => {
				// if token was bad or otherwise invalid or expired (if set), reject
        if (err) return reject(err);
				// hand back payload info
        resolve(payload);
      });
			
    });

  }
};