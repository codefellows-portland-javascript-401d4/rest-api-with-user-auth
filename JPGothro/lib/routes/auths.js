
const router = require('express').Router();
const jsonParser = require('body-parser').json();
const User = require('../models/user');
const token = require('../auth/token');
const ensureAuth = require('../auth/ensure-auth');

router.post('/validate', ensureAuth, (req, res, next) => {
    res.send({valid: true});
});

router.post('/signup', jsonParser, (req, res, next) => {
    const {username, password} = req.body;
    // now that we have the reference to the password, remove it
    delete req.body.password;

    if (!username || !password) {
        return next({
            code: 400,
            error: 'username and password are required'
        });
    };

    // ensure that the new user has a default role of 'read-only'
    // do NOT accept any role passed in through this route.
    // const workingUser = {username, password, role: ['read-only']};

    User.find({username})
        .count()
        .then(count => {
            if (count > 0) throw {code: 400, error: `username ${username} already exists`};
            const user = new User(req.body);
            user.generateHash(password);
            return user.save();
        })
        .then(user => token.sign(user))
        .then(token => res.send({token}))
        .catch(next);
});

router.post('/signin', jsonParser, (req, res, next) => {
    const {username, password} = req.body;
    if (!username || !password) {
        throw {code: 400, error: 'Missing username or password'};
    };

    // now that we have the reference to the password, remove it
    delete req.body.password;

    User.findOne({username})
        .then(user => {
            if (!user && !password && !user.compareHash(password)){
                throw {code: 400, error: 'Invalid username or password'};
            };
            return token.sign(user);
        })
        .then(token => res.send({token}))
        .catch(next);
});

module.exports = router;
