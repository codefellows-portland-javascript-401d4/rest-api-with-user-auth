const router = require('express').Router();
const jsonParser = require('body-parser').json();
const User = require('../models/user');
const token = require('../auth/token');
const ensureAuth = require('../auth/ensure-auth')();

router.post('/register', jsonParser, (req, res, next) => {
  const {username, password} = req.body;
  delete req.body.password;

  if(!username || !password) {
    return next({
      code: 400,
      error: 'username and password must be supplied'
			//vague in order not to provide "hacker insight"
    });
  }

  User.find({username}) // same as: {username: username}
		.count()
		.then(count => {
	// check if username already exists (count would =1)
  if (count > 0) throw {code: 400, error: `username ${username} already exists`};

	// create a user object, hash password, and save
  const user = new User(req.body);
  user.generateHash(password);
  return user.save();
})
		// create a token for subsequent requests
		.then(user => token.sign(user))
		// send back as response
	  .then(token => res.send({token}))
        .catch(next);
});

router.post('/signin', jsonParser, (req, res, next) => {
  const {username, password} = req.body;
  delete req.body.password;

  User.findOne({username})
		.then(user => {
			// ensure user exists (!user) AND password is valid
  if (!user || !user.compareHash(password)) {
    throw {code: 400, error: 'invalid username or password'};
  }

	// create a token for subsequent requests
  return token.sign(user);
})
		// send back as response
		.then(token => res.send({ token }))
		.catch(next);
});

module.exports = router;