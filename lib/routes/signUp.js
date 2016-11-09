const router = require('express').Router();
const jsonParser = require('body-parser').json();
const User = require('../model/user');
const token = require('../auth/token');
// const ensureAuth = require('../auth/ensure-auth')();

router.post('/', jsonParser, (req, res, next) => {
	console.log('signup route triggered');
	// req.body will have username and password properties
	const { username, password } = req.body;
	
	// we have a reference, so remove from body
	delete req.body.password;

	if(!username || !password) {
		return next({
			code: 400,
			error: 'username and password must be supplied'
		});
	}

	// try and find user that already has this user name
	User.find({ username }) // same as: { username: username }
		.count()
		.then(count => {
			// check if username already exists
			if (count > 0) 
				throw { code: 400, error: `username ${username} already exists`};
			else{
			// create a user object, hash password, and save
				const user = new User(req.body);
				console.log('Username saved as ', username);
				user.generateHash(password);
				return user.save();
			}
		})
		// create a token for subsequent requests
		.then(user => token.sign(user))
		// send back as response
		.then(token => res.send({ token }))
        .catch(next);
});

module.exports = router;