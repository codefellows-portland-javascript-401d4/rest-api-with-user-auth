const router = require('express').Router();
const jsonParser = require('body-parser').json();
const User = require('../model/user');
const token = require('../auth/token');
// const ensureAuth = require('../auth/ensure-auth')();



router.post('/signin', jsonParser, (req, res, next) => {
	// req.body will have username and password
	const { username, password } = req.body;
	// we have a reference, so remove from body
	delete req.body.password;

	// find User by username
	User.findOne({ username })
		.then(user => {
			// ensure user exists (!user) AND password is valid
			if (!user || !user.compareHash(password)) {
				throw { code: 400, error: 'invalid username or password' };
			}

			// create a token for subsequent requests
			return token.sign(user);
		})
		// send back as response
		.then(token => res.send({ token }))
		.catch(next);
});

module.exports = router;