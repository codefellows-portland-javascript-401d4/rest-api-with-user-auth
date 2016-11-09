const router = require('express').Router();
const bodyParser = require('body-parser').json;
const User = require('../models/user');
const authorize = require('../auth/authorize');


router.post('/join', bodyParser, (req, res, next) => {
    const {username, password} = req.body;
    del req.body.password;
    if (!username || !password) {
        return next({code: 400, error: 'Must supply a Username and Password'});
    }
    User.find({username})
        .count()
        .then(count => {
            if (count > 0) throw {code: 400, error: `user: ${username} already exists`}
            cont user = new User (req.body);
            user.generateHash(password);
            return user.save();
        })
        .then(user => token.sign(user))
        .then(token => res.send({token}))
    .catch(next);
})