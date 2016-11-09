const router = require('express').Router();
const jsonParser = require('body-parser').json();
const User = require('../models/user');
const token = require('../auth/token');
const ensureAuth = require('../auth/ensure-auth')();

router.get('/', (req, res, next) => {
    let query = {};
    if(req.query) {
        query = req.query;
    }
    User.find(query)
        .lean()
        .then(users => {
            res.send(users);
        })
        .catch(next);
});

router.delete('/', (req, res, next) => {
    User.remove({})
        .then(deleted => res.send(deleted))
        .catch(next);
});

//eslint-disable-next-line no-unused-vars
router.post('/validate', ensureAuth, (req, res, next) => {
    res.send({valid: true});
});

router.post('/signup', jsonParser, (req, res, next) => {
    /*
    const {username, password} = req.body;

    is the same as

    const username = req.body.username;
    const password = req.body.password;
     */
    const {username, password} = req.body;
   

    delete req.body.password;

    if(!username || !password) {
        return next({
            code: 400,
            error: 'username and password required'
        });
    }

    User.find({username}) //same as {username: username}
        .count()
        .then(count => {
            if(count > 0) throw {code: 400, error: `username ${username} already exists`};

            const user = new User(req.body);
            user.generateHash(password);
            return user.save();
        })
        .then(user => token.sign(user))
        .then(token => res.send({token})) //JSON object with key of 'token'
        .catch(next);
});

router.post('/signin', jsonParser, (req, res, next) => {
    const {username, password} = req.body;

    delete req.body.password;

    User.findOne({username})
        .then(user => {
            if(!user || !user.compareHash(password)) {
                throw {code: 400, error: 'invalid username or password'};
            }
            return token.sign(user);
        })
        .then(token => res.send({token}))
        .catch(next);
});

module.exports = router;

