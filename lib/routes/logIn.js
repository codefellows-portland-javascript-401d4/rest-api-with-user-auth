const router = require('express').Router();
const jsonParser = require('body-parser').json();
const User = require('../model/user');
const token = require('../auth/token');
const checkAuth = require('../auth/checkAuth')();

// validate a token (is it good)
router.post('/validate', checkAuth, (req, res, next) => { //eslint-disable-line
	res.send({ valid: true });
});


//This login route takes in a user name and pword and generated a token
router.post('/', jsonParser, (req, res, next) => {
	console.log('Login route triggered');
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