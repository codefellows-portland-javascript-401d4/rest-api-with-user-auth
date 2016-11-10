const router = require('express').Router();
const bodyParser = require('body-parser').json();
const User = require('../models/user');
const authorize = require('../auth/authorized');
const authCheck = require('../auth/authCheck');

// router.post('/validate', authCheck, (req, res, next) => {
//     res.send({valid: true});
// });

router
    .post('/join', bodyParser, (req, res, next) => {
        console.log(req);
        const {username, password} = req.body;
        delete req.body.password;
        if (!username || !password) {
            return next({code: 400, error: 'Must supply a Username and Password'});
    }
    User.find({username})
        .count()
        .then(count => {
            if (count > 0) throw {code: 400, error: `user: ${username} already exists`}
            const user = new User (req.body);
            user.generateHash(password);
            return user.save();
        })
        .then(user => token.sign(user))
        .then(token => res.send({token}))
    .catch(next);
})

router.post('/login', bodyParser, (req, res, next) => {
    const {username, password} = req.body;
    delete req.body.password;
    User.findOne({username})
        .then(user => {
            if (!user || !user.compareHash(password)) {
                throw { code: 400, error: 'Incorrect user/pass combination'}
            }
            return token.sign(user);
        })
        .then(token => res.send({token}))
        .catch(next);
})

module.exports = router;